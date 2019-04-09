<template>
  <div id="app">
    <DatePicker ref="DatePickerPreset" v-model="datePreset"/>
    <div @click="$refs.DatePickerPreset.show()" >Выбраная дата: {{datePreset}}</div>

    <DatePicker ref="DatePickerIn" changeRange="in" v-model="date"/>
    <div @click="$refs.DatePickerIn.show()" >Только левая дата: {{date}}</div>
    <DatePicker ref="DatePickerOut" changeRange="out" v-model="date"/>
    <div @click="$refs.DatePickerOut.show()" >Только правая дата: {{date}}</div>

    <DatePicker ref="DatePicker2" lang="en" v-model="date2"/>
    <div @click="$refs.DatePicker2.show()">Choice date #2: {{date2}}</div>



    <DatePicker ref="DatePickerSingle" lang="en" type="single" v-model="dateSingle"/>
    <div @click="$refs.DatePickerSingle.show()">Single: {{dateSingle}}</div>
  </div>
</template>

<script>
import DatePicker from "./DatePicker";

export default {
  name: "app",
  components: {
    DatePicker,
  },
  created(){

  },
  data() {
    return {
      datePreset: { in: new Date(), out: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate()+2
        )},
      date: {},
      date2: {},
      dateSingle: {}
    }
  }
};
</script>

<style lang="scss"scoped>
</style>
