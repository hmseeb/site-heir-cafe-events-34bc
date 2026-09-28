/* ==========================================================================
   HEIR Cafe & Events — site scripts
   Vanilla JS only. No external libraries, no APIs, no environment variables.
   ========================================================================== */
(function () {
  'use strict';

  /* ----------------------------------------------------------------------
     Mobile navigation
     ---------------------------------------------------------------------- */
  function initNav() {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.getElementById('primary-nav');
    if (!toggle || !links) return;

    function close() {
      links.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    }

    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    document.addEventListener('click', function (e) {
      if (!links.classList.contains('is-open')) return;
      if (links.contains(e.target) || toggle.contains(e.target)) return;
      close();
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 860) close();
    });
  }

  /* ----------------------------------------------------------------------
     Sticky header shadow
     ---------------------------------------------------------------------- */
  function initHeader() {
    var header = document.querySelector('.site-header');
    if (!header) return;
    function onScroll() {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ----------------------------------------------------------------------
     Scroll reveal
     ---------------------------------------------------------------------- */
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    Array.prototype.forEach.call(items, function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
      io.observe(el);
    });
  }

  /* ----------------------------------------------------------------------
     Footer year
     ---------------------------------------------------------------------- */
  function initYear() {
    var nodes = document.querySelectorAll('[data-year]');
    var year = String(new Date().getFullYear());
    Array.prototype.forEach.call(nodes, function (el) {
      el.textContent = year;
    });
  }

  /* ----------------------------------------------------------------------
     Quote / contact forms
     Submissions are posted to the LeadrVision forms endpoint (the same URL
     as the form's action attribute, so the form still works without JS).
     A thank-you message is shown in place of the form status on success,
     and also when the visitor returns with ?submitted=1 in the URL.
     ---------------------------------------------------------------------- */
  var FORM_ENDPOINT = 'https://vision.leadrai.com/api/forms/718b86bc85f23b02a8d75b390a663ca4';
  var SENT_MESSAGE =
    'Thanks, your message was sent. We\'ll reply within one business day &mdash; or call ' +
    '<a href="tel:+17609007350">(760) 900-7350</a> for a faster answer.';

  function initForms() {
    var forms = document.querySelectorAll('form[data-lead-form]');
    Array.prototype.forEach.call(forms, initForm);
  }

  function initForm(form) {
    if (!form) return;

    var status = form.querySelector('.form-status') || document.getElementById('form-status');

    // Record the current page so visitors return here after a plain submit.
    var pageField = form.querySelector('[data-page-field]');
    if (pageField) pageField.value = window.location.href;

    // Returning from a no-JavaScript submission.
    if (/[?&]submitted=1(&|$)/.test(window.location.search) && status) {
      status.className = 'form-status is-visible is-success';
      status.innerHTML = SENT_MESSAGE;
    }
    var emailRe = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

    function fieldWrap(input) {
      return input.closest('.field');
    }

    function setError(input, message) {
      var wrap = fieldWrap(input);
      if (!wrap) return;
      var msg = wrap.querySelector('.error-msg');
      if (message) {
        wrap.classList.add('has-error');
        input.setAttribute('aria-invalid', 'true');
        if (msg) msg.textContent = message;
      } else {
        wrap.classList.remove('has-error');
        input.removeAttribute('aria-invalid');
        if (msg) msg.textContent = '';
      }
    }

    function digits(value) {
      return (value || '').replace(/\D/g, '');
    }

    function validateField(input) {
      var value = (input.value || '').trim();
      var label = input.getAttribute('data-label') || input.name;

      if (input.hasAttribute('required') && !value) {
        setError(input, 'Please enter your ' + label.toLowerCase() + '.');
        return false;
      }
      if (input.type === 'email' && value && !emailRe.test(value)) {
        setError(input, 'Please enter a valid email address.');
        return false;
      }
      if (input.type === 'tel' && value && digits(value).length < 10) {
        setError(input, 'Please enter a 10-digit phone number.');
        return false;
      }
      if (input.name === 'Message' && value && value.length < 10) {
        setError(input, 'Please add a little more detail (10+ characters).');
        return false;
      }
      setError(input, '');
      return true;
    }

    var inputs = Array.prototype.slice.call(
      form.querySelectorAll('input:not([type="hidden"]):not([name="_gotcha"]), select, textarea')
    );

    inputs.forEach(function (input) {
      input.addEventListener('blur', function () { validateField(input); });
      input.addEventListener('input', function () {
        if (fieldWrap(input) && fieldWrap(input).classList.contains('has-error')) {
          validateField(input);
        }
      });
    });

    function showStatus(kind, html) {
      if (!status) return;
      status.className = 'form-status is-visible is-' + kind;
      status.innerHTML = html;
    }

    function payload() {
      var data = {};
      Array.prototype.forEach.call(form.elements, function (el) {
        if (!el.name || el.type === 'submit' || el.type === 'button') return;
        data[el.name] = (el.value || '').trim();
      });
      data._form = data._form || form.getAttribute('data-lead-form') || 'Website Form';
      data._page = window.location.href;
      return data;
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot: silently ignore bot submissions.
      var hp = form.querySelector('[name="_gotcha"]');
      if (hp && hp.value) return;

      if (pageField) pageField.value = window.location.href;

      var firstInvalid = null;
      inputs.forEach(function (input) {
        var ok = validateField(input);
        if (!ok && !firstInvalid) firstInvalid = input;
      });

      if (firstInvalid) {
        showStatus('error', 'Please correct the highlighted fields and try again, or call us at <a href="tel:+17609007350">(760) 900-7350</a>.');
        firstInvalid.focus();
        return;
      }

      var submitBtn = form.querySelector('[type="submit"]');
      var submitLabel = submitBtn ? submitBtn.innerHTML : '';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending&hellip;';
      }
      showStatus('info', 'Sending your request&hellip;');

      function restore() {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = submitLabel;
        }
      }

      function onSuccess() {
        restore();
        showStatus('success', SENT_MESSAGE);
        form.reset();
        if (pageField) pageField.value = window.location.href;
        inputs.forEach(function (input) { setError(input, ''); });
      }

      function onFailure() {
        restore();
        showStatus(
          'error',
          'Sorry — we couldn\'t send your request just now. Please try again, or call ' +
          '<a href="tel:+17609007350">(760) 900-7350</a> instead.'
        );
      }

      // No fetch support: fall back to a plain HTML POST to the same endpoint.
      if (typeof window.fetch !== 'function') {
        form.submit();
        return;
      }

      window.fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload())
      }).then(function (res) {
        if (!res.ok) throw new Error('Request failed: ' + res.status);
        return res.json().catch(function () { return { ok: true }; });
      }).then(function (data) {
        if (data && data.ok === false) throw new Error(data.error || 'Request failed');
        onSuccess();
      }).catch(function () {
        onFailure();
      });
    });
  }

  /* ----------------------------------------------------------------------
     FAQ — keep one answer open at a time within a group
     ---------------------------------------------------------------------- */
  function initFaq() {
    var groups = document.querySelectorAll('[data-faq]');
    Array.prototype.forEach.call(groups, function (group) {
      var items = group.querySelectorAll('details');
      Array.prototype.forEach.call(items, function (item) {
        item.addEventListener('toggle', function () {
          if (!item.open) return;
          Array.prototype.forEach.call(items, function (other) {
            if (other !== item) other.open = false;
          });
        });
      });
    });
  }

  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    initNav();
    initHeader();
    initReveal();
    initYear();
    initForms();
    initFaq();
  });
})();
