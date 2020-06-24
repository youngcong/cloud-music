<template>
  <div class="index-container">
    <!-- 导航区域 -->
    <div class="nav">
      <ul>
        <li>
          <router-link to="/discovery">
            <span class="iconfont icon-find-music"></span>
            发现音乐
          </router-link>
        </li>
        <li>
          <router-link to="/playlists">
            <span class="iconfont icon-music-list"></span>
            推荐歌单
          </router-link>
        </li>
        <li>
          <router-link to="/songs">
            <span class="iconfont icon-music"></span>
            最新音乐
          </router-link>
        </li>
        <li>
          <router-link to="/mvs">
            <span class="iconfont icon-mv"></span>
            最新MV
          </router-link>
        </li>
      </ul>
    </div>
    <!-- 主体区域 -->
    <div class="main">
      <router-view></router-view>
    </div>
    <!-- 播放标签 -->
    <div class="player">
      <audio :src="musicUrl" autoplay id="music" ref="music"></audio>
    </div>
    <div class="bottom-wrapper">
      <el-progress
        class="progress"
        :percentage="percent"
        :show-text="false"
        color="rgb(199, 51, 47)"
      ></el-progress>
      <div class="bottom-info">
        <div class="music-info" v-if="Object.keys(item).length !== 0">
          <div class="left">
            <img
              class="album-pic"
              :src="item.al.picUrl+'?param=40y40'"
              alt=""
            />
          </div>
          <div class="right">
            <div class="basic-info">
              <span class="name">{{ item.name }}</span>
              -
              <span class="artist">{{ item.ar[0].name }}</span>
            </div>
            <div class="timer">
              <span class="current">{{ currentTime | playTimeFormat }}</span>
              /
              <span class="duration">{{ item.dt | playTimeFormat }}</span>
            </div>
          </div>
        </div>
        <div v-else class="space"></div>
        <div class="controller">
          <i class="iconfont icon-step-backward"></i>
          <i class="iconfont icon-pause" v-if="isPlaying" @click="playOrPause()"></i>
          <i class="iconfont icon-play" v-else @click="playOrPause()"></i>
          <i class="iconfont icon-stepforward"></i>
        </div>
        <div class="menu">
          <i class="iconfont icon-bars"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMusicUrl, getMusicInfo } from 'network/request'
import throttle from 'lodash/throttle'

export default {
  name: "index",
  data() {
    return {
      item: {},
      musicUrl: "",
      isPlaying: false,
      percent: 0,
      currentTime: 0
    };
  },
  mounted() {
    //订阅消息
    this.$pubSub.subscribe("pauseAudio", msg => {
      var audio = document.getElementById("music");
      audio.pause();
    });

    this._timeUpdate = throttle(() => {
      console.log(this.$refs.music.currentTime)
      this.currentTime = this.$refs.music.currentTime * 1000
      this.percent = this.currentTime / this.item.dt * 100
    }, 250)
  },
  watch: {
    async item() {
      const { data: urlResp } = await getMusicUrl(this.item.id)
      if (!urlResp.data[0].url) {
        return this.$message.error('该资源为VIP专享，暂不支持播放 ！')
      }
      // 设置给父组件的播放地址
      this.musicUrl = urlResp.data[0].url
      this.isPlaying = true

      this.$refs.music.addEventListener('timeupdate', this._timeUpdate)
    }
  },
  methods: {
    playOrPause() {
      if (!this.musicUrl) {
        return
      }
      if (this.isPlaying) {
        this.$refs.music.pause()

      } else {
        this.$refs.music.play()
      }
      this.isPlaying = !this.isPlaying
    },
  }
};
</script>

<style scoped>
.bottom-wrapper {
  background: #f1f3f4;
  height: 66px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
}
.bottom-wrapper .bottom-info {
  height: 60px;
  display: flex;
  flex: 1;
  justify-content: space-between;
}
.bottom-wrapper .bottom-info .music-info,
.bottom-wrapper .bottom-info .space,
.bottom-wrapper .bottom-info .controller,
.bottom-wrapper .bottom-info .menu {
  flex-basis: 30%;
}
.bottom-wrapper .bottom-info .music-info {
  display: flex;
  /* justify-content: space-between; */
  align-items: center;
}
.bottom-wrapper .bottom-info .music-info .album-pic {
  border-radius: 5px;
  margin: 0 8px;
}
.bottom-wrapper .bottom-info .controller {
  display: flex;
  width: 100px;
  justify-content: center;
  align-items: center;
}
.bottom-wrapper .bottom-info .controller .icon-play,
.bottom-wrapper .bottom-info .controller .icon-pause {
  background: rgb(199, 51, 47);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  text-align: center;
  line-height: 40px;
  margin: 0 10px;
}
.bottom-wrapper .bottom-info .controller .icon-step-backward,
.bottom-wrapper .bottom-info .controller .icon-stepforward {
  color: rgb(199, 51, 47);
  font-size: 22px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  text-align: center;
  line-height: 30px;
}
.bottom-wrapper .bottom-info .menu {
  line-height: 60px;
  margin-right: 10px;
  text-align: right;
}
</style>
