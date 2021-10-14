const circleWidth = 140;

(function () {
  document
    .querySelector('html')
    .style.setProperty('--icon-size', circleWidth + 'px');
})();
(function ($) {
  $.fn.shuffle = function () {
    var allElems = this.get(),
      getRandom = function (max) {
        return Math.floor(Math.random() * max);
      },
      shuffled = $.map(allElems, function () {
        var random = getRandom(allElems.length),
          randEl = $(allElems[random]).clone(true)[0];
        allElems.splice(random, 1);
        return randEl;
      });

    this.each(function (i) {
      $(this).replaceWith($(shuffled[i]));
    });

    return $(shuffled);
  };
})(jQuery);
(function () {
  var initialSetup = function (options) {
    options
      .css('width', circleWidth)
      .css('height', circleWidth)
      .css('top', function (index) {
        return circleWidth * Math.floor(index / 6);
      })
      .css('left', function (index) {
        return circleWidth * (index % 6);
      })
      .on('click', function () {
        $(this).toggleClass('selected');
        rearrange(options);
      });
  };

  var rearrange = function (options) {
    var num = options
      .filter('.selected')
      .css('top', function (index) {
        return circleWidth * Math.floor(index / 6);
      })
      .css('left', function (index) {
        return circleWidth * (index % 6);
      }).length;

    options
      .not('.selected')
      .css('top', function (index) {
        return circleWidth * Math.floor((index + num) / 6);
      })
      .css('left', function (index) {
        return circleWidth * ((index + num) % 6);
      });

    function trans(n) {
      return n * 70 + (Math.floor((n + 5) / 6) + Math.floor(n / 6)) * 5;
    }

    const transform = 'translate(' + trans(num) + 'px,0px)';
    $('polyline')
      .css('-webkit-transform', transform)
      .css('transform', transform);
  };

  var toTheCircle = function (options) {
    const defaultSize = 6 * circleWidth;
    var n, size, gapAngle;

    n = options.length;

    if (n === 1) {
      gapAngle = 0;
      size = defaultSize;
    } else {
      gapAngle = 360 / n;
      size = defaultSize / (1 + 1 / Math.sin(Math.PI / n));
    }

    const translation = (defaultSize - size) / 2;

    function getTransform(index) {
      return (
        'rotate(' +
        (n - 1 - index) * gapAngle +
        'deg) translate(0,-' +
        translation +
        'px)'
      );
    }

    options
      .css('height', size)
      .css('width', size)
      .css('top', translation)
      .css('left', translation)
      .css('-webkit-transform', getTransform)
      .css('transform', getTransform);
  };

  var dispense = function (option) {
    option
      .css('-webkit-transform', 'rotate(2000deg) translate(400px, 1500px)')
      .css('transform', 'rotate(2000deg) translate(400px, 1500px)')
      .one('transitionend', function () {
        option.hide();
      });
  };

  var spin = function (container, options) {
    var n = options.length;
    var shuffledOptions = options.shuffle();
    var spewTime = Math.floor(10000 / (n + 1));
    var luckyWinner = shuffledOptions.last();
    var luckyWinnerName = luckyWinner.data('name');

    shuffledOptions.slice(0, -1).each(function (index) {
      var option = $(this);
      setTimeout(function () {
        dispense(option);
        toTheCircle(shuffledOptions.slice(index + 1));
      }, spewTime * (index + 1));
    });

    container
      .css('-webkit-transform', 'rotate(3600deg)')
      .css('transform', 'rotate(3600deg)')
      .on('transitionend', function (e) {
        if (e.target == this) {
          $('#winnerMessage').show().children().text(luckyWinnerName);
          $('#congratulations').show().children().text(luckyWinnerName);
        }
      });
  };

  $(function () {
    initialSetup($('.option'));

    $('#setup').click(function () {
      $('.option').not('.selected').fadeOut();

      toTheCircle($('.option.selected'));

      $(document).on('wheel', function () {
        spin($('.options'), $('.option.selected'));
      });
    });
  });
})();
