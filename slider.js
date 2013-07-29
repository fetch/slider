(function($){

  $.fn.extend({
    slider: function(options){
      return $(this).each(function(){
        var slider = $(this).data('slider');
        if(slider){
          if(typeof options == 'string' && slider[options]){
            slider[options]();
          }
        }else{
          $(this).data('slider', new Slider(this, options));
        }
      });
    }
  });

  $.fn.slider.defaults = {
    auto: false,
    continuous: false
  };

  var Slider = function(element, options){
    this.el = element;
    this.options = $.extend({}, $.fn.slider.defaults, options);
    this.$el = $(this.el);

    this.init();
  };

  Slider.prototype = {

    constructor: Slider,

    current: 1,

    length: 0,

    animating: false,

    playTimeout: null,

    $: function(selector){
      return this.$el.find(selector);
    },

    init: function(){
      this.$controls = this.$('.controls');
      this.$tray = this.$('.slides');
      this.$slides = $('.slide', this.$tray);
      this.length = this.$slides.length;

      this.$controls.on('click', 'li:not(.current)', $.proxy(function(event){
        var slide = $(event.currentTarget).index() + 1;
        this.slide(slide);
      }, this));

      this.$controls.on('click', '.next', $.proxy(function(event){
        this.next();
      }, this));

      this.$controls.on('click', '.prev', $.proxy(function(event){
        this.prev();
      }, this));

      $('li', this.$controls).removeClass('current').first().addClass('current');
      this.$slides.removeClass('current').first().addClass('current');

      if(this.options.auto) this.play();
    },

    play: function(){
      this.playTimeout = setTimeout($.proxy(this.next, this), this.options.auto);
      this.$el.trigger('play');
    },

    stop: function(){
      this.options.auto = 0;
      clearTimeout(this.playTimeout);
      this.$el.trigger('stop');
    },

    next: function(){
      if(this.current !== this.length){
        this.slide(this.current + 1);
      }else if(this.options.continuous){
        this.slide(1);
      }
    },

    prev: function(){
      if(this.current !== 1){
        this.slide(this.current - 1);
      }else if(this.options.continuous){
        this.slide(this.length);
      }
    },

    slide: function(slide){
      if(this.animating) return;
      clearTimeout(this.playTimeout);
      this.animating = true;

      $('li', this.$controls).removeClass('current').eq(slide - 1).addClass('current');

      var current = $('.slide.current', this.$tray)
        , next = this.$slides.eq(slide - 1);

      next.addClass(slide > this.current ? 'next' : 'prev');
      next.one('transitionend', $.proxy(function(){
        next.removeClass('next prev');
        current.removeClass('current prev next');
        this.animating = false;
        if(this.options.auto) this.play();
      }, this));
      setTimeout(function(){
        next.addClass('current');
      });
      this.current = slide;
      this.$el.trigger('slide', {slide: slide});
    }

  };

  this.Slider = Slider;
  
}).call(this, jQuery);
