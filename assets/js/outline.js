'use strict';

// Accordion
// -----------------------------------------------------------------------------
var accordion = function accordion() {
  var $accordionPanel = void 0,
      accordionHeader = void 0,
      accordionContent = void 0,
      $this = void 0;

  $accordionPanel = $('.accordion_panel');
  accordionHeader = '.accordion_panel-header';
  accordionContent = '.accordion_panel-content';

  $accordionPanel.on('click', accordionHeader, function () {
    $this = $(this);
    $this.next(accordionContent).slideToggle();
    $this.parent().siblings().children(accordionContent).slideUp();
    return false;
  });
};

// Demo usage
(function ($) {
  accordion();
})(jQuery);
'use strict';

// For IE 10 on Windows Mobile 8
var msViewportStyle = void 0;

if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
  msViewportStyle = document.createElement('style');
  msViewportStyle.appendChild(document.createTextNode('@-ms-viewport{width:auto!important}'));
  document.head.appendChild(msViewportStyle);
}
//# sourceMappingURL=outline.js.map
