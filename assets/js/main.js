// For IE 10 on Windows Mobile 8
let msViewportStyle;

if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
  msViewportStyle = document.createElement('style');
  msViewportStyle.appendChild(
    document.createTextNode(
      '@-ms-viewport{width:auto!important}'
    )
  );
  document.head.appendChild(msViewportStyle);
}
