<template>
<div>
    <p>{{ name }}</p>
    <div :id="id" v-show="playable">    
    <video-player class="vjs-custom-skin"
                  ref="videoPlayer"
                  :options="playerOptions"
                  :playsinline="true"
                  @play="onPlayerPlay($event)"
                  @pause="onPlayerPause($event)"
                  @ended="onPlayerEnded($event)"
                  @loadeddata="onPlayerLoadeddata($event)"
                  @waiting="onPlayerWaiting($event)"
                  @playing="onPlayerPlaying($event)"
                  @timeupdate="onPlayerTimeupdate($event)"
                  @canplay="onPlayerCanplay($event)"
                  @canplaythrough="onPlayerCanplaythrough($event)"
                  @ready="playerReadied"
                  @statechanged="playerStateChanged($event)">
  </video-player>
</div>
<div v-show="!playable">
  Video is not playable!
</div>
    <hr>
</div>
</template>

<script>
export default {
  props: ["video"], // video is an object with id and url of video file
  data: function() {
    return {
      message: "Hi from Vue",
      // videojs options
      playerOptions: {
        height: "360",
        autoplay: true,
        muted: true,
        language: "en",
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [
          {
            type: "video/mp4",
            // mp4
            src: this.video.link
            // webm
            // src: "https://cdn.theguardian.tv/webM/2015/07/20/150716YesMen_synd_768k_vp8.webm"
          }
        ]
        // poster:
        //   "https://surmon-china.github.io/vue-quill-editor/static/images/surmon-1.jpg"
      },
      playable: false,
      // pass the video info
      id: "video" + this.video.id,
      link: this.video.link,
      name: ""
    };
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player;
    }
  },

  mounted() {
    // console.log('this is current player instance object', this.player)
    setTimeout(() => {
      console.log("dynamic change options", this.player);
      this.player.muted(false);
    }, 2000);

    // get the name of audio file, that is the last part of link
    var temp = this.link.split("/");
    this.name = temp[temp.length - 1];
  },
  methods: {
    // listen event
    onPlayerPlay(player) {
      // console.log('player play!', player)
    },
    onPlayerPause(player) {
      // console.log('player pause!', player)
    },
    onPlayerEnded(player) {
      // console.log('player ended!', player)
    },
    onPlayerLoadeddata(player) {
      // console.log("player Loadeddata!", player);
    },
    onPlayerWaiting(player) {
      // console.log('player Waiting!', player)
    },
    onPlayerPlaying(player) {
      // console.log('player Playing!', player)
    },
    onPlayerTimeupdate(player) {
      // console.log('player Timeupdate!', player.currentTime())
    },
    onPlayerCanplay(player) {
      // console.log("player Canplay!", player);
      this.playable = true;
      // console.log(this.playable);
    },
    onPlayerCanplaythrough(player) {
      // console.log('player Canplaythrough!', player)
    },
    // or listen state event
    playerStateChanged(playerCurrentState) {
      // console.log('player current update state', playerCurrentState)
    },
    // player is ready
    playerReadied(player) {
      // seek to 10s
      console.log("example player 1 readied");

      player.currentTime(10);
      // console.log('example 01: the player is readied', player)
    }
  }
};
</script>

<style scoped>
</style>
