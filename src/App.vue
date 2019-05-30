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


    <DatePicker ref="DatePickerstartDisable" v-model="datestartDisable" :startDisable="new Date('2019-02-10')"/>
    <div @click="$refs.DatePickerstartDisable.show()" >Выбраная дата ВЫКЛ даты: {{datestartDisable}}</div>




    <DatePicker ref="DatePickerSingle" lang="en" type="single" v-model="dateSingle"/>
    <div @click="$refs.DatePickerSingle.show()">Single: {{dateSingle}}</div>

    <DatePicker ref="DatePickerTranslation" lang="en" type="single" :i18n="i18n" v-model="dateTranslation"/>
    <div @click="$refs.DatePickerTranslation.show()">Translation: {{dateTranslation}}</div>

    <DatePicker ref="DatePickerTranslation" lang="en" type="single" :i18n="i18n" v-model="dateTranslation" />
    <div @click="$refs.DatePickerTranslation.show()">Translation: {{dateTranslation}}</div>
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
      i18n: {en: { reset: 'Свой текст удаления' } },
      datePreset: { in: new Date(), out: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate()+2
        )},
      datestartDisable: {},
      date: {},
      date2: {},
      dateSingle: {},
      dateTranslation: {}
    }
  }
};
</script>

<style lang="scss"scoped>
</style>
