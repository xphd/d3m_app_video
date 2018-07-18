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
</div>
</template>

<script>
import RawVideoViewSingle from "./RawVideoViewSingle.vue";
export default {
  data: function() {
    return {
      numOfFirstLoaded: 2, // numver of videos firstly loaded
      numOfEachLoaded: 5, // numver of videos loaded each time the button is pressed
      videoLinks: [], // list of videos from backend response
      videos: [], // video objects, {id, videoLink} where auidoLink is from videoLinks
      numOfvideoLinks: 0, // number of videoLinks totally, initialize as 0
      indexOfLastLoaded: -1, // record the index of the last loaded video
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