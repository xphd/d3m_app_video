<template>
<div>
    <div>
        <template v-for="video in videos">
            <RawVideoViewSingle :video='video' :key="video.id"></RawVideoViewSingle>
        </template>
    </div>
    <p><strong>{{ indexOfLastLoaded+1 }}</strong> of {{ numOfvideoLinks }} Loaded</p>
    <div v-if="isMoreVideos">
        Load Another
        <input type="number" min="1" max="500" v-model.number="numOfEachLoaded"> Videos
        <button @click="loadVideos()" class="btn btn-success">Go!</button>
    </div>
    <div v-else>
        <button disabled class="btn btn-warning">No More videos</button>
    </div>
    <br>
    <div>
        View First
        <input type="number" min="1" :max="numOfVideoLinks" v-model.number="numOfLoaded"> Videos
        <button @click="loadVideosTotal()" class="btn btn-success">Go!</button>
    </div>

</div>
</template>

<script>
import RawVideoViewSingle from "./RawVideoViewSingle.vue";
export default {
  data: function() {
    return {
      numOfFirstLoaded: 2, // numver of videos firstly loaded
      numOfLoaded: 0, // total number of loaded video, this is just one more than indexOfLastLoaded
      indexOfLastLoaded: -1, // record the index of the last loaded video
      numOfEachLoaded: 5, // numver of videos loaded each time the button is pressed
      videoLinks: [], // list of videos from backend response
      videos: [], // video objects, {id, videoLink} where auidoLink is from videoLinks
      numOfVideoLinks: 0, // number of videoLinks totally, initialize as 0
      isMoreVideos: true
    };
  },
  sockets: {
    connect: function() {
      // console.log("Client: connect to Server");
    },
    // listen for "returnvideoLinks" emmited from backend with data "videoLinks"
    responseVideoLinks: function(videoLinks) {
      this.$store.videoLinks = videoLinks;
      this.videoLinks = this.$store.videoLinks;
      this.numOfvideoLinks = this.videoLinks.length; // update numOfvideoLinks
      this.loadVideos(this.numOfFirstLoaded); // when get videoLinks from backend, load some of them
    }
  },
  methods: {
    loadVideosTotal() {
      // calculate the difference between wanted number of loaded videos and current number of loaded Videos
      var difference = this.numOfLoaded - (this.indexOfLastLoaded + 1);
      console.log(this.numOfLoaded);
      if (difference >= 0) {
        // if difference > 0, aka wanted more than current, just load more "difference" Videos
        this.loadVideos(difference);
      } else {
        // else, pick up the first wanted number of Videos, and update something
        this.videos = this.videos.splice(0, this.numOfLoaded);
        this.indexOfLastLoaded = this.numOfLoaded - 1;
        this.isMoreVideos = true;
      }
    },
    loadVideos(numToLoad = this.numOfEachLoaded) {
      // if there is no more videos, then return
      if (!this.isMoreVideos) {
        return;
      }
      var len = this.numOfvideoLinks;
      var indexLastEnd = this.indexOfLastLoaded;
      var indexEnd = Math.min(indexLastEnd + numToLoad, len - 1);
      this.indexOfLastLoaded = indexEnd;
      for (var i = indexLastEnd + 1; i <= indexEnd; i++) {
        var video = {
          id: i,
          link: this.videoLinks[i]
        };
        this.videos.push(video);
      }
      // if all videos have been loaded, indexOfLastLoaded is same as numOfvideoLinks-1, no more video to load
      if (this.indexOfLastLoaded == this.numOfvideoLinks - 1) {
        this.isMoreVideos = false;
      }
    },
    // emit "getvideoLinks" to backend server
    requestVideoLinks() {
      this.$socket.emit("requestVideoLinks");
    }
  },
  created() {
    this.requestVideoLinks();
    this.numOfLoaded = this.numOfFirstLoaded;
  },
  components: {
    RawVideoViewSingle
  }
};
</script>

<style scoped>
input {
  text-align: right;
  border: 1px solid black;
}
</style>