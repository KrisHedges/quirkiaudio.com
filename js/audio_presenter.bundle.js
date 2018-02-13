'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

function presenterStart() {
  var presenter_elements = Array.from(document.getElementsByClassName('audio-presenter')),
      presenters = [];

  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    var _loop = function _loop() {
      var _step$value = _slicedToArray(_step.value, 2),
          index = _step$value[0],
          presenter = _step$value[1];

      var source = presenter.getAttribute('data-source'),
          message = presenter.getAttribute('data-message'),
          timeline = presenter.getAttribute('data-timeline'),
          template = '\n        <div class="player">\n          <progress value="0" max="100"></progress>\n          <button class="play"></button>\n        </div>\n        <section class="presentation">' + message + '</section>\n        <audio id="music" controls="controls">\n          <source src="' + source + '" type="audio/mpeg" />\n        </audio>\n    ';

      presenter.innerHTML = template;

      function pushPresenter(timeline) {
        presenters.push({
          'playButton': presenter.getElementsByClassName('player')[0],
          'audioElement': presenter.getElementsByTagName('audio')[0],
          'progressBar': presenter.getElementsByTagName('progress')[0],
          'presentationElement': presenter.getElementsByClassName('presentation')[0],
          'timeline': timeline
        });
      }

      fetch(timeline).then(function (response) {
        response.json().then(function (data) {
          pushPresenter(data);
          presenters.forEach(function (presenter) {
            presenter.audioElement.load();

            presenter.audioElement.addEventListener('timeupdate', function () {
              updateProgress(presenter.progressBar, presenter.audioElement, presenter.presentationElement, presenter.timeline);
            });
            presenter.audioElement.addEventListener('ended', function () {
              resetPlayer(presenter);
            });
            presenter.audioElement.addEventListener('pause', function () {
              resetPlayer(presenter);
            });
            presenter.playButton.addEventListener('touch', function () {
              playPauseAudio(presenter.playButton, presenter.audioElement);
            });
            presenter.playButton.addEventListener('click', function () {
              playPauseAudio(presenter.playButton, presenter.audioElement);
            });
          });
        });
      });
    };

    for (var _iterator = presenter_elements.entries()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      _loop();
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}

function playPauseAudio(button, audio) {
  if (audio.paused) {
    button.classList.add('playing');
    audio.play();
  } else {
    button.classList.remove('playing');
    audio.pause();
    audio.currentTime = 0;
  }
}

function presentAtTime(now, presentation, timeline) {
  function isSlide(slide) {
    return now >= slide.time ? slide : false;
  }
  var slide = timeline.map(function (slide) {
    return isSlide(slide);
  }).filter(Boolean);
  if (presentation.innerHTML !== slide[slide.length - 1].content) {
    presentation.innerHTML = slide[slide.length - 1].content;
  }
}

function updateProgress(progressbar, audio, presentation, timeline) {
  var now = audio.currentTime;
  var progress = Math.round(now / audio.duration * 100);
  progressbar.value = progress ? progress : 0;
  if (!audio.paused) {
    presentAtTime(now, presentation, timeline);
  }
}

function resetPlayer(presenter) {
  presenter.presentationElement.innerHTML = "Have A Listen.";
  presenter.audioElement.currentTime = 0;
}

document.onreadystatechange = function () {
  if (document.readyState === "interactive") presenterStart();
};