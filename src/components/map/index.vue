<template>
  <el-link type="primary" href="/">back</el-link>
  <div class="cls-map-box">
    <div :id="data.domId" class="cls-map-container" />
    <div class="cls-legend">
      <label v-for="(val, k) in state.allCheckList" :key="k">
        <input
          type="checkbox"
          :label="k"
          v-model="state.allCheckList[k]"
          @change="methods.handleChange(k)"
        />{{ k }}
      </label>
    </div>
  </div>
</template>
<script setup>
/**ts写起来还是顺手，还是js顺手🤦‍♂️ */
import { reactive, onMounted, onUnmounted } from "vue";
import mapboxgl from "mapbox-gl";
import MapboxLanguage from "@mapbox/mapbox-gl-language";
import POINTJSON from "./point.json";
const state = reactive({ allCheckList: {'apple': true,'banana': true, 'mango': true} });
const data = {
  domId: "map-container",
  map: null,
  popup: null,
  sourceKey: "earthquakes",
  clustersKey: "clusters",
  types: [],
};
onMounted(() => {
  methods.mapInit();
});
onUnmounted(()=>{
  data.map = null
  data.popup=null
})
const methods = {
  handleChange: (k) => {
    let layerID = 'unclustered_point_' + k
    data.map.setLayoutProperty(
      layerID,
      'visibility',
      state.allCheckList[k] ? 'visible' : 'none'
    )
  },
  mapInit: () => {
    // 设置token
    mapboxgl.accessToken =
      "pk.eyJ1IjoiZGluZ2xpMTIzIiwiYSI6ImNra204ODhjczBobTgyeHJ6MmJpZHMxNWgifQ.NbKrXh_hb2gvjr5CEMDnyQ";
    // 设置中文
    mapboxgl.setRTLTextPlugin(
      "https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.1.0/mapbox-gl-rtl-text.js"
    );
    // 初始化地图
    data.map = new mapboxgl.Map({
      container: "map-container",
      style: "mapbox://styles/mapbox/dark-v10",
      center: [-243.60929489135745, 39.916714596441984],
      zoom: 3,
    });
    // 设置中文
    data.map.addControl(
      new MapboxLanguage({
        defaultLanguage: "zh",
      })
    );
    data.map.on("load", function () {
      methods.addSource();
      methods.addLayer();
    });
  },
  addSource: () => {
    // 添加打点数据
    data.map.addSource("earthquakes", {
      type: "geojson",
      // Point to GeoJSON data. This example visualizes all M1.0+ earthquakes
      // from 12/22/15 to 1/21/16 as logged by USGS' Earthquake hazards program.
      data: POINTJSON,
      cluster: true,
      clusterMaxZoom: 14, // Max zoom to cluster points on
      clusterRadius: 50, // Radius of each cluster when clustering points (defaults to 50)
    });
  },
  addLayer: () => {
    methods.addPopup();
    methods.addClusters();
    methods.addPoints();
  },
  addPopup: () => {
    // 添加popup提示框
    data.popup = new mapboxgl.Popup({
      anchor: "bottom-left",
      offset: {
        "bottom-left": [20, -20],
      },
      className: "cls-popup-box",
      closeButton: false,
    });
  },
  addImgs: (k, cb) => {
    // 添加图片
    const map = data.map;
    if (!map.hasImage(`image-${k}`)){
      map.loadImage(`src/components/map/${k}.png`, function (error, image) {
        if (error) throw error;
        map.addImage("image-"+k, image);
        cb()
      });
    }
  },
  addClusters: () => {
    // 添加聚合层
    const { clustersKey, map, popup, sourceKey } = data;
    map.addLayer({
      id: clustersKey,
      type: 'circle',
      source: sourceKey,
      filter: ['has', 'point_count'],
      paint: {
        'circle-color': [
          'step',
          ['get', 'point_count'],
          'rgba(120, 83, 145, 0.5)', //小于10个点数显示颜色
          10,
          'rgba(255, 215, 0, 0.5)' //大于10个点数
        ],
        'circle-radius': [
          'step',
          ['get', 'point_count'],
          55, //小于10个点数 圆圈半径
          10,
          80 //大于10个点数 圆圈半径
        ]
      }
    })
    // 点击聚合图层地图级别中心点变化
    map.on('click', clustersKey, function(e) {
      const features = map.queryRenderedFeatures(e.point, { layers: [clustersKey] })
      const clusterId = features[0].properties.cluster_id
      map
        .getSource(sourceKey)
        .getClusterExpansionZoom(clusterId, function(err, zoom) {
          if (err) return
          map.easeTo({
            center: features[0].geometry.coordinates,
            zoom: zoom
          })
        })
    })
    // 聚合图层鼠标移入样式
    map.on('mouseenter', clustersKey, function(e) {
      map.getCanvas().style.cursor = 'pointer'
      const clusterId = e.features[0].properties.cluster_id
      map
        .getSource(sourceKey)
        .getClusterLeaves(clusterId, 10000, 0, (error, features) => {
          if (!(features && features.length)) return
          let dataObj = {}
          features.forEach((d) => {
            dataObj[d.properties.type] = dataObj[d.properties.type] === undefined ? 1 : dataObj[d.properties.type] + 1
          })
          popup.setLngLat(e.lngLat)
          let content = Object.keys(dataObj)
            .map(
              (k) => `<div style="display:flex;flex-flow:row nowrap;justify-content:space-between;"><span>点个数：</span><span style="color:#ddd;">${dataObj[k]}个</span></div>`
            )
            .join('')
          popup.setHTML(content)
          popup.addTo(map)
        })
    })
    // 聚合图层鼠标移出鼠标样式
    map.on('mouseleave', clustersKey, function() {
      map.getCanvas().style.cursor = ''
      popup.remove()
    })
  },
  addPoints: () => {
    // 添加打点
    const map = data.map;
    const types = ['apple','banana', 'mango']
    types.forEach(k=>{
      methods.addImgs(k, ()=>{
        methods.addPoint(k, `unclustered_point_${k}`)
      })
    })
  },
  addPoint: (type, layerKey) => {
    const { map, sourceKey } = data;
    // 添加非聚合点
    map.addLayer({
      id: layerKey,
      type: 'symbol',
      source: sourceKey,
      filter: [ // 判断条件 type=type && point_count === undefined
        'all',
        ['==', 'type', type],
        ['!has', 'point_count']
      ],
      layout: {
        'icon-image': `image-${type}`
      }
    })
    methods.pointEvent(type, layerKey);
    console.log("addPoint", `image-${type}`, map.hasImage(`image-${type}`));
  },
  pointEvent: (type, layerKey) => {
    const { map, popup } = data;
    // 未聚合图层点击pop框显示
    map.on("mouseenter", layerKey, function (e) {
      // 改变鼠标样式
      console.log("pointEvent-mouseenter", e);
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("click", layerKey, function (e) {
      map.easeTo({
        center: [e.lngLat.lng, e.lngLat.lat],
      });
      let features = e.features[0].properties;
      popup.setLngLat(e.lngLat);
      popup.setHTML(
        `type: ${features.type}<br>lng: ${e.lngLat.lng}<br>lat: ${e.lngLat.lat}`
      );
      popup.addTo(map);
    });
    // 未聚合图层鼠标移出pop框隐藏
    map.on("mouseleave", layerKey, function () {
      // 改变鼠标样式
      map.getCanvas().style.cursor = "";
      popup.remove();
    });
  },
};
</script>
<style>
@import url("https://api.mapbox.com/mapbox-gl-js/v2.1.1/mapbox-gl.css");
.cls-map-box .mapboxgl-control-container {
  display: none;
}
.cls-map-box {
  position: relative;
  height: 100vh;
}
.cls-map-container {
  height: 100vh;
}
.cls-legend {
  position: absolute;
  bottom: 0;
  left: 10%;
  height: 45px;
  color: white;
}
.cls-popup-box {
}
</style>