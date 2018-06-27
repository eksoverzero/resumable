(function($) {
  $.fn.ṛesumable = function(options) {
    // Default settings
    var settings = $.extend({
      filePath: '/',
      browseSelector: '.resumable-browse',
    }, options);

    return this.each(function() {
      $this = this;

      this.resumable = new Resumable(settings);

      if(!this.resumable.support) {
        location.href = this.fallbackUrl;
      }

      this.files = {};
      this.progress = 0;
      this.fileCount = 0;
      this.progressPercent = 0;

      // If there is not browse to upload link, create it
      // TODO: This won't work if a selector other than a direct
      //       class or id is used (.class or #id)
      if ($(this).find(settings.browseSelector).length == 0) {
        $(this).append('<a href="javascript:void(0);" class="' + settings.browseSelector.substr(1) + '">Browse</a>');
      }

      // Create and set the thumbnails/individual progress unordered list
      $(this).append('<ul class="resumable-thumbnails"></ul>');
      this.resumableFiles = $(this).find('.resumable-thumbnails')

      // Create and set the overall progress div
      $(this).append(
        '<div class="resumable-progress" style="display:none;">\
        <div class="resumable-progress-bar">\
        <div class="resumable-progress-precent">0%</div>\
        </div>\
        </div>'
      );
      this.resumableProgress = $(this).find('.resumable-progress')

      // Create and set the log unordered list
      $(this).append('<ul class="resumable-log"></ul>');
      this.resumableLog = $(this).find('.resumable-log')

      this.resumable.assignDrop($(this));
      this.resumable.assignBrowse($(this).find(settings.browseSelector));

      this.resumable.on('fileAdded', function(resumableFile) {
        $this.resumableFiles.append(
          '<li id="' + resumableFile.uniqueIdentifier + '">\
          <img src="' + (window.URL || window.webkitURL || window.mozURL).createObjectURL(resumableFile.file) + '" />\
          <div class="resumablefile-progress">\
          <div class="resumablefile-progress-bar">\
          <div class="resumablefile-progress-percent">0%</div>\
          </div>\
          </div>\
          </li>'
        );

        $this.resumableProgress.show();
        $this.resumable.upload();
      });

      this.resumable.on('fileError', function(file, message) {
        $this.setFileProgress(file.uniqueIdentifier, -1);


        $('li#' + file.uniqueIdentifier).addClass('has-error');
        $this.resumableLog.prepend('<li class="fileError">Error: ' + message + '</li>');
      });

      this.resumable.on('fileRetry', function(file) {});
      this.resumable.on('fileSuccess', function(file, message) {
        $this.setFileProgress(file.uniqueIdentifier, 1);

        $('li#' + file.uniqueIdentifier).addClass('is-completed');
        $this.resumableLog.prepend('<li class="fileSuccess">Success: ' + message + '</li>');
      });
      this.resumable.on('fileProgress', function(file) {
        $this.setFileProgress(file.uniqueIdentifier, file.progress());
        $this.setProgress($this.resumable.progress());
      });

      this.resumable.on('complete', function(file) {});
      this.resumable.on('pause', function(file) {
        $this.resumableProgress.addClass('is-paused');
        $this.resumableProgress.removeClass('is-completed');
      });

      this.setProgress = function(progress){
        $this.resumableProgress.removeClass('is-paused is-completed');
        if(progress>=1) $this.resumableProgress.addClass('is-completed');

        var progressPercent = Math.floor(Math.floor(progress*100.0));

        $this.resumableProgress.find('.resumable-progress-precent').html(progressPercent + ' %');
        $this.resumableProgress.find('.resumable-progress-bar').css({width:progressPercent + '%'});
      }

      this.setFileProgress = function(identifier, progress){
        var progressPercent = Math.floor(Math.round(progress*100.0));
        var resumableProgress = $('li#' + identifier);

        resumableProgress.find('.resumablefile-progress-percent').html(progressPercent + ' %');
        resumableProgress.find('.resumablefile-progress-bar').css({width:progressPercent + '%'});
      }
    });
  }
}(jQuery));

