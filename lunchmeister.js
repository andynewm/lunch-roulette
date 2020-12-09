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
      .css('width', 70)
      .css('height', 70)
      .css('top', function (index) {
        return 70 * Math.floor(index / 6);
      })
      .css('left', function (index) {
        return 70 * (index % 6);
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
        return 70 * Math.floor(index / 6);
      })
      .css('left', function (index) {
        return 70 * (index % 6);
      }).length;

    options
      .not('.selected')
      .css('top', function (index) {
        return 70 * Math.floor((index + num) / 6);
      })
      .css('left', function (index) {
        return 70 * ((index + num) % 6);
      });

    function trans(n) {
      return n * 70 + Math.floor((n + 5) / 6) * 5 + Math.floor(n / 6) * 5;
    }

    $('polyline')
      .css('-webkit-transform', 'translate(' + trans(num) + 'px,0px)')
      .css('transform', 'translate(' + trans(num) + 'px,0px)')
  }

  var toTheCircle = function (options) {
    var n, size, gapAngle;

    n = options.length;

    if (n === 1) {
      gapAngle = 0;
      size = 420;
    } else {
      gapAngle = 360 / n;
      size = 420 / (1 + 1 / Math.sin((Math.PI * gapAngle) / 360));
    }

    function circleTransform(index) {
      return (
        'rotate(' +
        (n - 1 - index) * gapAngle +
        'deg) translate(0,-' +
        (210 - size / 2) +
        'px)'
      )
    }

    options
      .css('height', size)
      .css('width', size)
      .css('top', 210 - size / 2)
      .css('left', 210 - size / 2)
      .css('-webkit-transform', circleTransform)
      .css('transform', circleTransform)
  }

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

      function choose() {
        spin($('.options'), $('.option.selected'))
      }

      $(document).on('wheel', choose)
    })
  })
})()
