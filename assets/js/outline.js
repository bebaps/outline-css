'use strict';

// Accordion
function accordion() {
  'use strict';

  var $accordionPanel, accordionHeader, accordionContent, $this;

  $accordionPanel = $('.accordion_panel');
  accordionHeader = '.accordion_panel-header';
  accordionContent = '.accordion_panel-content';

  $accordionPanel.on('click', accordionHeader, function () {
    $this = $(this);
    $this.next(accordionContent).slideToggle();
    $this.parent().siblings().children(accordionContent).slideUp();
    return false;
  });
}
'use strict';

(function ($) {
  accordion();
})(jQuery);
//# sourceMappingURL=outline.js.map
