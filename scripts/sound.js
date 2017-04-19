
var musicPlayer = {
  activeTrack : undefined,
  music : document.getElementById('music'),
  repeat : false,
  delay: false,
  tracks : {
    kata : {
    djemSo : 'assets/audio/music/forms/DjemSo.mp3',
    shiiCho : 'assets/audio/music/forms/Shii-Cho.mp3',
    makashi : 'assets/audio/music/forms/Makashi.mp3',
    soresu : 'assets/audio/music/forms/Soresu.mp3'
      },
    fight : {
      darkSide : 'assets/audio/music/fight/dark-edit.mp3',
      dramatic : 'assets/audio/music/fight/dramatic.mp3',
      epic : '',
      tragic : 'assets/audio/music/fight/tragic.mp3'
    },
    show : {
      scene1 : 'assets/audio/show/Scene1-pregame_mixdown.mp3',
      scene2 : 'assets/audio/show/scene2-sithintro_mixdown.mp3',
      scene3 : 'assets/audio/show/scene3-conversion_mixdown.mp3',
      scene4 : 'assets/audio/show/scene4-jedi_mixdown.mp3',
      scene5 : 'assets/audio/show/scene5-postgame_mixdown.mp3'
      }
  },

  toggleRepeat : function() { //controls the repeat button
    var rButton = document.getElementById('rButton');
    if (this.repeat) {
      rButton.style.backgroundColor = 'ivory';
    } else if (!this.repeat) {
      rButton.style.backgroundColor = '#849bff';
    }
    this.repeat = !this.repeat;
  },

  toggleDelay : function() {
    var dButton = document.getElementById('dButton');
    if (this.delay) {
      dButton.style.backgroundColor = 'ivory';
    } else if (!this.delay) {
      dButton.style.backgroundColor = '#849bff';
    }
    this.delay = !this.delay;
  },

  select : function(type, id) {
    var pButton = document.getElementById('pButton');
    var title = id.toUpperCase();
    var playHead = document.getElementById('playhead');
    document.querySelector('audio').setAttribute('src', this.tracks[type][id]);
    document.getElementById('title').textContent = title;
    this.activeTrack = this.tracks[type][id];
    pButton.className = 'play';
    playHead.style.marginLeft = '0px';
  },

  playMusic : function() { //actually plays the track, and gets the timeline handling going
    var interval;
    var delay;
    var pButton = document.getElementById('pButton');
    if (this.activeTrack === undefined) {
      return;
    }

    handlers.setupTimelineHandler();
    if (musicPlayer.music.paused) {
      musicPlayer.music.play();
      pButton.className = '';
		  pButton.className = 'pause';
		  interval = setInterval(display.showNumbers, 300);
    } else {
      musicPlayer.music.pause();
		  pButton.className = '';
		  pButton.className = 'play';
		  clearInterval(interval);
  }
  }
};

var handlers = {
 setupClickHandlers : function() { //sets up handlers for track selection
  //  document.getElementById('kata').addEventListener('click', function(event) {
  //    track = event.target.id;
  //    if (track === '' || track === 'kata') {
  //      return;
  //    }
  //    musicPlayer.select('kata', track);
  //    display.clearActives();
  //    display.makeActive(event.target);
  //  });
    document.getElementById('show').addEventListener('click', function(event) {
      track = event.target.id;
      if (track === '' || track === 'show') {
        return;
      }
      musicPlayer.select('show', track);
      display.clearActives();
      display.makeActive(event.target);
    });
  //  document.getElementById('force').addEventListener('click', function(event) {
  //    track = event.target.id;
  //    if (track === '' || track === 'force') {
  //      return;
  //    }
  //    musicPlayer.select('force', track);
  //    display.clearActives();
  //    display.makeActive(event.target);
  //  });
 },

 setupTimelineHandler : function() { //creates the event listeners that update the timeline
    musicPlayer.music.addEventListener("timeupdate", handlers.timeUpdate, false);
    musicPlayer.music.addEventListener('canplaythrough', function() {
      handlers.duration = musicPlayer.music.duration;
    }, false);
  document.getElementById('timeline').addEventListener("click", function (event) {
	  musicPlayer.music.currentTime = music.duration * handlers.clickPercent(event);
  	display.moveplayhead(event);
}, false);
  display.showNumbers();
 },

 duration : undefined,
  timeUpdate : function() {
  var pButton = document.getElementById('pButton');
  var playHead = document.getElementById('playhead');
	var playPercent = 100 * (musicPlayer.music.currentTime / musicPlayer.music.duration);
	playHead.style.marginLeft = playPercent + "%";
	if (musicPlayer.music.currentTime == this.duration && musicPlayer.repeat === false) {
        pButton.className = "";
        pButton.className = "play";
    } else if (musicPlayer.music.currentTime == this.duration) {
      musicPlayer.music.currentTime = 0;
      musicPlayer.playMusic();
    }
  },

  playHandler : function() {
    var delay;
    if (musicPlayer.delay && musicPlayer.music.paused && musicPlayer.music.currentTime === 0) {
      delay = window.setTimeout(function(){musicPlayer.playMusic();}, 10000);
    } else {
      musicPlayer.playMusic();
    }
  },

  clickPercent: function(e) {
    var timeline = document.getElementById('timeline');
    var playerMargin = document.getElementById('player');
	return (e.pageX - (timeline.offsetLeft + player.offsetLeft)) / timeline.offsetWidth;
},



};


var display = {
  moveplayhead : function(e) {
  var playHead = document.getElementById('playhead');
	var newMargLeft = e.pageX - timeline.offsetLeft;
	if (newMargLeft !== 0 && newMargLeft !== timeline.offsetWidth) {
		playHead.style.marginLeft = newMargLeft + 'px';
	}
	if (newMargLeft ===  0) {
		playHead.style.marginLeft = '0px';
	}
	if (newMargLeft === timeline.offsetWidth) {
		playHead.style.marginLeft = timeline.offsetWidth + 'px';
	}

},

  showNumbers : function() { //displays track time in seconds and minutes, does math to keep the display intuitive
    if (track_duration.className !== '') {
      track_duration.className = '';
      elapsed.className = '';
    }
    var xMinutes = Math.floor(parseInt(musicPlayer.music.currentTime) / 60);
    var yMinutes = Math.floor(parseInt(musicPlayer.music.duration) / 60);
    var xSeconds = parseInt(musicPlayer.music.currentTime);
    var ySeconds = parseInt(musicPlayer.music.duration);
    if (xMinutes > 0) {
      xSeconds = xSeconds - (xMinutes * 60);
    }
    if (yMinutes > 0) {
      ySeconds = ySeconds - (yMinutes * 60);
    } //logic to ensure that seconds translate to minutes
    if (xSeconds.toString().length < 2) {
      xSeconds = '0' + xSeconds.toString();
    }
    if (ySeconds.toString().length < 2) {
      ySeconds = '0' + ySeconds.toString();
    } //these two statements add 0s to the beginning to match the format the user expects

    elapsed.textContent = xMinutes + ':' + xSeconds;
    track_duration.textContent = yMinutes + ':' + ySeconds;
  },

  makeActive : function(element) {
    element.className = 'track-heading bold lite-up active_track';
  },

  clearActives : function() {
    //var kataList = document.getElementById('kata').childNodes;
    var showList = document.getElementById('show').childNodes;
    //var forceList = document.getElementById('force').childNodes;
    // kataList.forEach(function(node){
    //   if (node.nodeName === 'P') {
    //     node.className = 'track-heading bold lite-up inactive_track';
    //   }
    // });
    fiteList.forEach(function(node){
      if (node.nodeName === 'P') {
        node.className = 'track-heading bold lite-up inactive_track';
      }
    });
    // forceList.forEach(function(node){
    //   if (node.nodeName === 'P') {
    //     node.className = 'track-heading bold lite-up inactive_track';
    //   }
    // });
  }
};

handlers.setupClickHandlers();


musicPlayer.music.addEventListener('canplay', function() {
    display.showNumbers();
}, false);
