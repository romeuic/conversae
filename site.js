// "Copiar endereço" for visitors whose device has no mail app behind mailto:.
// Plain ES5 so it runs on older browsers; falls back to execCommand where
// the async clipboard API is missing or the page is not on HTTPS.
(function () {
  var line = document.getElementById('copy-line');
  var button = document.getElementById('copy-email');
  var status = document.getElementById('copy-status');
  if (!line || !button || !status || !document.addEventListener) return;

  var address = button.getAttribute('data-email');

  function report(ok) {
    status.textContent = ok
      ? 'Endereço copiado: ' + address
      : 'Não deu para copiar. O endereço é ' + address;
  }

  function copyWithTextarea() {
    var field = document.createElement('textarea');
    var ok = false;
    field.value = address;
    field.setAttribute('readonly', '');
    field.className = 'sr-only';
    document.body.appendChild(field);
    field.select();
    try {
      field.setSelectionRange(0, address.length);
      ok = document.execCommand('copy');
    } catch (e) {
      ok = false;
    }
    document.body.removeChild(field);
    button.focus();
    report(ok);
  }

  button.addEventListener('click', function () {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(address).then(function () {
        report(true);
      }, copyWithTextarea);
    } else {
      copyWithTextarea();
    }
  });

  line.removeAttribute('hidden');
})();
