<template>
  <div id="app">
    <DatePicker ref="DatePickerPreset" v-model="datePreset" />
    <div @click="$refs.DatePickerPreset.show()">
      Выбраная дата: {{ datePreset }}
    </div>

    <DatePicker ref="DatePickerIn" v-model="date" change-range="in" />
    <div @click="$refs.DatePickerIn.show()">Только левая дата: {{ date }}</div>
    <DatePicker ref="DatePickerOut" v-model="date" change-range="out" />
    <div @click="$refs.DatePickerOut.show()">
      Только правая дата: {{ date }}
    </div>

    <DatePicker ref="DatePicker2" v-model="date2" lang="en" />
    <div @click="$refs.DatePicker2.show()">Choice date #2: {{ date2 }}</div>

    <DatePicker
      ref="DatePickerstartDisable"
      v-model="datestartDisable"
      :start-disable="new Date('2019-02-10')"
      :end-disable="new Date('2020-03-10')"
    />
    <div @click="$refs.DatePickerstartDisable.show()">
      Выбраная дата ВЫКЛ даты: {{ datestartDisable }}
    </div>

    <DatePicker
      ref="DatePickerSingle"
      v-model="dateSingle"
      lang="en"
      type="single"
    />
    <div @click="$refs.DatePickerSingle.show()">Single: {{ dateSingle }}</div>

    <DatePicker
      ref="DatePickerTranslation"
      v-model="dateTranslation"
      size="small"
      lang="en"
      type="single"
      :i18n="i18n"
    />
    <div @click="$refs.DatePickerTranslation.show()">
      Translation Single: {{ dateTranslation }}
    </div>

    <DatePicker
      ref="DatePickerTranslation2"
      v-model="dateTranslation"
      lang="en"
      type="single"
      :i18n="i18n"
    />
    <div @click="$refs.DatePickerTranslation2.show()">
      Translation Single2: {{ dateTranslation }}
    </div>

    <DatePicker
      ref="DatePickerPreset"
      v-model="datePreset"
      :employment="employment"
    />
    <div @click="$refs.DatePickerPreset.show()">
      Занятые даты: {{ datePreset }}
    </div>

    <br />

    <DatePicker
      ref="DatePickerOneMonthSingle"
      v-model="DatePickerOneMonthSingle"
      :employment="employment"
      :show-header="false"
      size="small"
      type="single"
    />
    <div @click="$refs.DatePickerOneMonthSingle.toggle()">
      Одномесячный на одну дату: {{ DatePickerOneMonthSingle }}
    </div>

    <br />

    <DatePicker
      ref="DatePickerOneMonth"
      v-model="dateOneMonth"
      :employment="employment"
      :show-header="false"
      size="small"
    />
    <div @click="$refs.DatePickerOneMonth.show()">
      Одномесячный: {{ dateOneMonth }}
    </div>
  </div>
</template>

<script>
import DatePicker from "./DatePicker";

export default {
  name: "App",
  components: {
    DatePicker
  },
  data() {
    return {
      i18n: { en: { reset: "Свой текст удаления" } },
      employment: [
        {
          from: new Date("2019-08-28 14:00:00"),
          to: new Date("2019-09-09 12:00:00")
        },
        {
          from: new Date("2019-09-10 14:00:00"),
          to: new Date("2019-09-11 12:00:00")
        },
        {
          from: new Date("2019-09-22 14:00:00"),
          to: new Date("2019-09-24 12:00:00")
        }
      ],
      datePreset: {
        in: new Date(),
        out: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate() + 2
        )
      },
      datestartDisable: {},
      date: {},
      date2: {},
      dateSingle: {},
      dateTranslation: null,

      dateOneMonth: {},
      DatePickerOneMonthSingle: new Date("2020-09-30 12:00:00")
    };
  },
  created() {}
};
</script>

<style lang="scss" scoped></style>
