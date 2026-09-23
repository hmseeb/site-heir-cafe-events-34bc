/* ==========================================================================
   HEIR Cafe & Events — GoHighLevel lead intake
   Receives website form submissions and creates/updates the contact in the
   GoHighLevel sub-account (location 7tl0VyRfoq5B5I8dnuP8).

   Requires a GoHighLevel private-integration / API token in the environment:
     GHL_API_KEY  (aliases: GHL_ACCESS_TOKEN, HIGHLEVEL_API_KEY)
   ========================================================================== */

var LOCATION_ID = '7tl0VyRfoq5B5I8dnuP8';
var API_BASE = 'https://services.leadconnectorhq.com';
var API_VERSION = '2021-07-28';
var LEAD_TAG = 'website-lead';
var LEAD_SOURCE = 'Website';

// Custom fields to set, by the field name configured in the sub-account.
var CF_LEAD_SOURCE = 'Lead Source';
var CF_WEBSITE_FORM = 'Website Form';

var customFieldCache = null;

function token() {
  return (
    process.env.GHL_API_KEY ||
    process.env.GHL_ACCESS_TOKEN ||
    process.env.HIGHLEVEL_API_KEY ||
    ''
  );
}

function headers() {
  return {
    Authorization: 'Bearer ' + token(),
    Version: API_VERSION,
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };
}

function str(value) {
  return typeof value === 'string' ? value.trim() : value == null ? '' : String(value).trim();
}

function splitName(body) {
  var first = str(body.first_name || body.firstName);
  var last = str(body.last_name || body.lastName);
  if (first || last) return { first: first, last: last };

  var full = str(body.name).replace(/\s+/g, ' ');
  if (!full) return { first: '', last: '' };
  var parts = full.split(' ');
  return { first: parts.shift(), last: parts.join(' ') };
}

/* Look up the location's custom fields so we can target "Lead Source" and
   "Website Form" by id (falls back to a slug key if the lookup is blocked). */
async function customFieldIds() {
  if (customFieldCache) return customFieldCache;
  var map = {};
  try {
    var res = await fetch(API_BASE + '/locations/' + LOCATION_ID + '/customFields', {
      method: 'GET',
      headers: headers()
    });
    if (res.ok) {
      var data = await res.json();
      var fields = (data && (data.customFields || data.customField)) || [];
      fields.forEach(function (field) {
        if (field && field.name) map[String(field.name).toLowerCase()] = field.id;
      });
      customFieldCache = map;
    }
  } catch (err) {
    // Non-fatal: fall through to key-based custom fields.
  }
  return map;
}

function customFieldEntry(map, name, value) {
  var id = map[name.toLowerCase()];
  if (id) return { id: id, field_value: value };
  return { key: name.toLowerCase().replace(/[^a-z0-9]+/g, '_'), field_value: value };
}

function buildNote(body, formName) {
  var lines = [
    'Website form submission — ' + formName,
    '',
    'Message: ' + (str(body.message) || 'Not provided')
  ];

  var extras = [
    ['Event type', body.event_type],
    ['Preferred date', body.event_date],
    ['Guest count', body.guests],
    ['Location / venue', body.location]
  ];
  extras.forEach(function (pair) {
    var value = str(pair[1]);
    if (value) lines.push(pair[0] + ': ' + value);
  });

  if (body.page_url) lines.push('Submitted from: ' + str(body.page_url));
  return lines.join('\n');
}

module.exports = async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(204).end();
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST, OPTIONS');
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  var body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (err) {
      return res.status(400).json({ ok: false, error: 'Invalid request body.' });
    }
  }
  if (!body || typeof body !== 'object') {
    return res.status(400).json({ ok: false, error: 'Invalid request body.' });
  }

  // Honeypot — pretend success so bots move on, but store nothing.
  if (str(body.company_website)) return res.status(200).json({ ok: true });

  var name = splitName(body);
  var email = str(body.email);
  var phone = str(body.phone);
  var message = str(body.message);
  var formName = str(body.form_name) || 'Website Form';

  if (!email && !phone) {
    return res.status(400).json({ ok: false, error: 'An email address or phone number is required.' });
  }

  if (!token()) {
    return res.status(503).json({
      ok: false,
      error: 'Lead delivery is not configured. Please call or email us instead.'
    });
  }

  try {
    var cfMap = await customFieldIds();

    var payload = {
      locationId: LOCATION_ID,
      firstName: name.first,
      lastName: name.last,
      name: [name.first, name.last].filter(Boolean).join(' '),
      email: email,
      phone: phone,
      source: LEAD_SOURCE,
      tags: [LEAD_TAG],
      customFields: [
        customFieldEntry(cfMap, CF_LEAD_SOURCE, LEAD_SOURCE),
        customFieldEntry(cfMap, CF_WEBSITE_FORM, formName)
      ]
    };

    Object.keys(payload).forEach(function (key) {
      if (payload[key] === '' || payload[key] == null) delete payload[key];
    });

    var upsert = await fetch(API_BASE + '/contacts/upsert', {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(payload)
    });

    var result = null;
    try {
      result = await upsert.json();
    } catch (err) {
      result = null;
    }

    if (!upsert.ok) {
      console.error('GoHighLevel upsert failed', upsert.status, result);
      return res.status(502).json({ ok: false, error: 'We could not save your request right now.' });
    }

    var contact = (result && (result.contact || result)) || {};
    var contactId = contact.id || contact._id || contact.contactId;

    // Store the visitor's message (and event details) as a note on the contact.
    if (contactId && message) {
      try {
        var note = await fetch(API_BASE + '/contacts/' + contactId + '/notes', {
          method: 'POST',
          headers: headers(),
          body: JSON.stringify({ body: buildNote(body, formName) })
        });
        if (!note.ok) console.error('GoHighLevel note failed', note.status);
      } catch (err) {
        console.error('GoHighLevel note error', err && err.message);
      }
    }

    return res.status(200).json({ ok: true, contactId: contactId || null });
  } catch (err) {
    console.error('GoHighLevel request error', err && err.message);
    return res.status(502).json({ ok: false, error: 'We could not save your request right now.' });
  }
};
