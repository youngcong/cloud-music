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
              :src="item.al.picUrl + '?param=40y40'"
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
          <i class="iconfont icon-step-backward" @click="prev"></i>
          <i
            class="iconfont icon-pause"
            v-if="isPlaying"
            @click="playOrPause()"
          ></i>
          <i class="iconfont icon-play" v-else @click="playOrPause()"></i>
          <i class="iconfont icon-stepforward" @click="next"></i>
        </div>
        <div class="menu" @click="showList = !showList">
          <i class="iconfont icon-bars"></i>
        </div>
      </div>
    </div>
    <div class="list" v-show="showList">
      <div class="top">总 {{ list.length }} 首</div>
      <div class="list-items">
        <div
          class="item-wrapper"
          :class="{ activePlaying: currentIndex === index }"
          v-for="(item, index) in list"
          :key="index"
          @dblclick="playInList(index)"
        >
          <span class="name">{{ item.name }}</span>
          <span class="artist">{{ item.ar[0].name }}</span>
          <span class="duration">{{ item.dt | playTimeFormat }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMusicUrl, getSongDetail } from "network/request";
import throttle from "lodash/throttle";

const ListWidth = 364;

export default {
  name: "index",
  data() {
    return {
      id: '',
      item: {},
      musicUrl: "",
      isPlaying: false,
      percent: 0,
      currentTime: 0,
      list: [],
      showList: false,
      currentIndex: 0,
      song: {}
    };
  },
  mounted() {
    //订阅消息
    this.$pubSub.subscribe("pauseAudio", msg => {
      var audio = document.getElementById("music");
      audio.pause();
    });

    this._timeUpdate = throttle(() => {
      // console.log(this.$refs.music.currentTime)
      this.currentTime = this.$refs.music.currentTime * 1000;
      this.percent = (this.currentTime / (this.item.dt || this.item.duration)) * 100;
    }, 250);

    window.addEventListener("click", e => {
      if (e.pageX < window.innerWidth - ListWidth) {
        this.showList = false;
      }
    });
  },
  watch: {
    async id() {
      const { data: songResp } = await getSongDetail(this.id)
      this.item = songResp.songs[0]

      const { data: urlResp } = await getMusicUrl(this.id);
      if (!urlResp.data[0].url) {
        this.musicUrl = ''
        this.isPlaying = false
        this.percent = 0
        return this.$message.error("该资源为VIP专享，暂不支持播放 ！");
      }
      this.musicUrl = urlResp.data[0].url;
      this.isPlaying = true;

      this.$refs.music.addEventListener("timeupdate", this._timeUpdate);

      if (this.list.length !== 0 && this.id != this.list[this.currentIndex].id) {
        this.currentIndex = -1
      }
    },
    async list() {
      this.currentIndex = 0;
      this.id = this.list[0].id;
    }
  },
  methods: {
    playOrPause() {
      if (!this.musicUrl) {
        return;
      }
      if (this.isPlaying) {
        this.$refs.music.pause();
      } else {
        this.$refs.music.play();
      }
      this.isPlaying = !this.isPlaying;
    },
    next() {
      this.currentIndex += 1;
      if (this.currentIndex === this.list.length) {
        this.currentIndex = 0;
      }
      this.id = this.list[this.currentIndex].id;
    },
    prev() {
      this.currentIndex -= 1;
      if (this.currentIndex === -1) {
        this.currentIndex = this.list.length - 1;
      }
      this.id = this.list[this.currentIndex].id;
    },
    playInList(index) {
      this.currentIndex = index
      this.id = this.list[this.currentIndex].id
    }
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
.bottom-wrapper .bottom-info .music-info .basic-info {
  color: #606266;
  font-size: 0.95em;
}
.bottom-wrapper .bottom-info .music-info .timer {
  font-size: 0.8em;
  color: #666;
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

.list {
  background-color: #fff;
  width: 364px;
  border-left: 1px solid #eee;
  height: calc(100% - 60px - 66px);
  position: fixed;
  top: 60px;
  right: 0;
  z-index: 100;
}
.list .top {
  color: rgb(202, 202, 202);
  padding: 20px;
}
.list .list-items .item-wrapper {
  display: flex;
  flex: 1;
  font-size: 0.9em;
  padding: 10px 20px;
}
.list .list-items .item-wrapper:nth-child(2n),
.list .list-items .item-wrapper:hover {
  background-color: #fafafa;
}
.list .list-items .item-wrapper .name {
  flex-basis: 50%;
}
.list .list-items .item-wrapper .artist {
  flex-basis: 40%;
  padding-left: 6px;
}
.list .list-items .item-wrapper .duration {
  flex-basis: 10%;
  text-align: right;
}
.list .activePlaying {
  color: rgb(199, 51, 47);
}
</style>
