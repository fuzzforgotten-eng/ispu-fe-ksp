<template>
  <div class="flex flex-col min-h-screen">
    <h1 class="text-3xl font-bold text-center p-4">INDOOR AQMS STASIUN <br>KAWASAN INDUSTRI KRAKATAU 2 PT KSP</h1>

    <div class="col-md-11 relative col-12">
      <div class="flex justify-center items-end gap-7 mx-auto my-4">
        <!-- Y-Axis -->
        <div class="relative flex flex-col justify-between h-[290px] text-sm font-semibold text-gray-700 mb-10">
          <div class="absolute right-0 top-0 h-full w-px bg-gray-400"></div>
          <div
            v-for="value in [600, 500, 400, 300, 200, 100, 0]"
            :key="value"
            class="relative flex items-center"
          >
            <span class="text-gray-800 absolute right-[10px]">{{ value }}</span>
            <span class="absolute right-0 h-px w-[6px] bg-gray-400"></span>
          </div>
        </div>

        <!-- Bar Chart -->
        <div
          v-for="(ispu, index) in ispuParams"
          :key="index"
          class="flex flex-col items-center"
        >
          <div
            class="border border-black rounded-xl h-[300px] relative flex justify-center overflow-hidden bg-transparent"
            :style="{ width: barBodyWidth }"
          >
            <div
              class="absolute bottom-0 left-0 w-full transition-all duration-300 ease-in-out rounded-b-xl z-10"
              :class="getBarClass(hourlyValues[index])"
              :style="{ height: getBarHeight(hourlyValues[index]), width: barWidth }"
            >
              <div
                class="absolute bottom-[5px] w-full text-center font-bold"
                :class="hourlyValues[index] < 50 ? '-translate-y-2.5 text-black' : 'text-white'"
              >
                {{ hourlyValues[index] || 0 }}
              </div>
            </div>
          </div>
          <div class="mt-[10px] text-center">
            <p class="text-center">{{ ispu.label }}</p>
          </div>
        </div>
      </div>

      <!-- Legend -->
      <div class="mt-6 flex justify-center items-center flex-wrap gap-[38px] pb-1">
        <div class="flex items-center gap-2">
          <div class="w-5 h-5 mr-[3px] rounded-[3px] bg-gradient-to-br from-[#8ce18c] to-[#5fd7ce]"></div>
          <div class="text-[13px] font-bold text-center">BAIK</div>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-5 h-5 mr-[3px] rounded-[3px] bg-gradient-to-b from-[#328aff] to-[#2736ff]"></div>
          <div class="text-[13px] font-bold text-center">SEDANG</div>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-5 h-5 mr-[3px] rounded-[3px] bg-gradient-to-b from-[#ffe331] to-[#ffa124]"></div>
          <div class="text-[13px] font-bold text-center">TIDAK SEHAT</div>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-5 h-5 mr-[3px] rounded-[3px] bg-gradient-to-b from-[#ff6437] to-[#ff2f3f]"></div>
          <div class="text-[13px] font-bold text-center">SANGAT TIDAK SEHAT</div>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-5 h-5 mr-[3px] rounded-[3px] bg-gradient-to-b from-[#313131] to-[#000]"></div>
          <div class="text-[13px] font-bold text-center">BERBAHAYA</div>
        </div>
      </div>
    </div>

    <!-- info -->
    <div class="w-full mt-3 mb-5">
      <div class="flex justify-center">
        <div class="flex w-[685px] justify-center gap-30 bg-white shadow-md rounded-lg py-4 text-center">
          <div>
            <p class="font-bold text-gray-700">WAKTU</p>
            <div>{{ lastData.datetime }}</div>
          </div>
          <div>
            <p class="font-bold text-gray-700">PARAMETER KRISIS</p>
            <div>{{ lastData.c_key }}</div>
          </div>
          <div>
            <p class="font-bold text-gray-700">ISPU</p>
            <div>{{ lastData.c_value }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- WEATHER -->
    <div class="flex justify-center mt-4">
      <div
        class="flex flex-wrap justify-center gap-4 bg-gradient-to-r from-blue-300 via-green-200 to-yellow-200 border border-gray-200 shadow-sm rounded-xl p-3 max-w-[758px] w-full"
      >
        <div
          v-for="(item, key) in weatherDisplay"
          :key="key"
          class="flex flex-col items-center justify-center bg-white/70 border border-gray-100 rounded-lg shadow-sm w-[90px] py-2 transition hover:shadow-md"
        >
          <p class="text-[11px] text-center font-bold text-gray-600 uppercase tracking-wide">
            {{ item.label }}
          </p>
          <p class="text-sm font-semibold text-gray-800">{{ item.value }}</p>
        </div>
      </div>
    </div>

    <div class="flex justify-center py-4 mt-auto">
      <img
        src="/src/assets/image/LOGO-CBI-2.png"
        alt="Company Logo"
        class="w-28 opacity-90 hover:opacity-100 transition"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import axios from "axios";
import { nextTick } from "vue";

const weather = reactive({
  temp: 0,
  humidity: 0,
  pressure: 0,
  wind_angle: 0,
  wspeed: 0,
  tprecipitation: 0,
  intensity: 0,
  pm10: 0,
  pm25: 0,
  so2: 0,
  co: 0,
  o3: 0,
  no2: 0,
  hc: 0,
});

const weatherDisplay = computed(() => {
  const gasArray = [
    { label: "PM10", value: `${weather.pm10?.toFixed(2)} µg/m³`, isGas: true },
    { label: "PM2.5", value: `${weather.pm25?.toFixed(2)} µg/m³`, isGas: true },
    { label: "SO₂", value: `${weather.so2?.toFixed(2)} µg/m³`, isGas: true },
    { label: "CO", value: `${weather.co?.toFixed(2)} µg/m³`, isGas: true },
    { label: "O₃", value: `${weather.o3?.toFixed(2)} µg/m³`, isGas: true },
    { label: "NO₂", value: `${weather.no2?.toFixed(2)} µg/m³`, isGas: true },
    { label: "HC", value: `${weather.hc?.toFixed(2)} µg/m³`, isGas: true },
  ];

  const weatherArray = [
    { label: "Suhu", value: `${weather.temp?.toFixed(2)} °C`, isGas: false },
    { label: "Kelembapan", value: `${weather.humidity?.toFixed(2)} %`, isGas: false },
    { label: "Tekanan", value: `${weather.pressure?.toFixed(2)} hPa`, isGas: false },
    { label: "Arah Angin", value: `${weather.wind_angle?.toFixed(2)}°`, isGas: false },
    { label: "Kec. Angin", value: `${weather.wspeed?.toFixed(2)} m/s`, isGas: false },
    { label: "Curah Hujan", value: `${weather.tprecipitation?.toFixed(2)} mm`, isGas: false },
    { label: "Solar Radiation", value: `${weather.intensity?.toFixed(2)} W/m²`, isGas: false },
  ];

  return [...gasArray, ...weatherArray];
});

const fetchData = async () => {
  try {
    const now = new Date();
    const yyyy = now.getUTCFullYear();
    const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(now.getUTCDate()).padStart(2, "0");

    const from_date = `${yyyy}-${mm}-${dd}T00:00:00.000Z`;
    const to_date = `${yyyy}-${mm}-${dd}T23:59:59.999Z`;

    const payload = {
      user_id: "524",
      station: JSON.stringify({ module_id: "256", station_id: "258" }),
      from_date,
      to_date,
      parameter: null,
      page: 1,
      per_page: 20,
    };

    const response = await axios.post("https://ksp.ispu.mdtapps.id/api/data/ispu", payload);
    const data = response.data.data?.[0];
    if (data) {
      ispuParams.value.forEach((param, index) => {
        const val = data[param.key];
        if (val !== null && val !== undefined) {
          hourlyValues.value[index] = val;
        }
      });
    }
  } catch (error) {
    console.error("Gagal fetch data:", error);
    throw error;
  }
};

const fetchWeather = async () => {
  try {
    const now = new Date();
    const yyyy = now.getUTCFullYear();
    const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
    const dd = String(now.getUTCDate()).padStart(2, "0");

    const from_date = `${yyyy}-${mm}-${dd}T00:00:00.000Z`;
    const to_date = `${yyyy}-${mm}-${dd}T23:59:59.999Z`;

    const payload = {
      user_id: "524",
      station: JSON.stringify({ module_id: "256", station_id: "258" }),
      from_date,
      to_date,
      parameter: null,
      page: 1,
      per_page: 20,
    };

    const response = await axios.post("https://ksp.ispu.mdtapps.id/api/data/weather", payload);
    const data = response.data.data?.[0];
    if (data) {
      weather.temp = data.temp;
      weather.humidity = data.humidity;
      weather.pressure = data.pressure;
      weather.wind_angle = data.wind_angle;
      weather.wspeed = data.wspeed;
      weather.tprecipitation = data.tprecipitation;
      weather.intensity = data.intensity;
      weather.pm10 = data.pm10;
      weather.pm25 = data.pm25;
      weather.so2 = data.so2;
      weather.co = data.co;
      weather.o3 = data.o3;
      weather.no2 = data.no2;
      weather.hc = data.hc;
    }
  } catch (error) {
    console.error("Gagal fetch weather:", error);
  }
};

const ispuParams = ref([
  { label: "PM10", key: "pm10" },
  { label: "PM2.5", key: "pm25" },
  { label: "SO2", key: "so2" },
  { label: "CO", key: "co" },
  { label: "O3", key: "o3" },
  { label: "NO2", key: "no2" },
  { label: "HC", key: "hc" },
]);

const hourlyValues = ref([]);
const lastData = reactive({
  datetime: "",
  c_key: "",
  c_value: "",
});

const barBodyWidth = ref("72.1px");
const barWidth = ref("70px");

function getBarHeight(value) {
  if (!value) return "0%";
  const maxValue = 600;
  const safeValue = Math.min(value, maxValue);
  return (safeValue / maxValue) * 100 + "%";
}

function getBarClass(value) {
  if (value >= 0 && value <= 50) return "bg-gradient-to-br from-[#8ce18c] to-[#5fd7ce] text-white";
  if (value >= 51 && value <= 100) return "bg-gradient-to-b from-[#328aff] to-[#2736ff] text-white";
  if (value >= 101 && value <= 200) return "bg-gradient-to-b from-[#ffe331] to-[#ffa124] text-white";
  if (value >= 201 && value <= 300) return "bg-gradient-to-b from-[#ff6437] to-[#ff2f3f] text-white";
  if (value > 300) return "bg-gradient-to-b from-[#313131] to-[#000] text-white";
  return "";
}

onMounted(() => {
  let socket;
  let reconnectInterval = 5000;
  let pingInterval;

  function connectWebSocket() {
    socket = new WebSocket("wss://ksp.ispu.mdtapps.id/ws");

    socket.addEventListener("open", () => {
      console.log("WebSocket connected");
      socket.send("Client ready");

      pingInterval = setInterval(() => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ type: "ping" }));
        }
      }, 30000);
    });

    socket.addEventListener("message", async (event) => {
      try {
        const parsed = JSON.parse(event.data);
        if (parsed.type === "DATA_2MENIT_UPDATE" && parsed.data?.data?.length) {
          const records = parsed.data.data;
          const latest = records[0];

          ispuParams.value.forEach((param, index) => {
            const val = latest[param.key];
            if (val !== null && val !== undefined && val !== 0) {
              hourlyValues.value[index] = val;
            }
          });

          await nextTick();

          const maxParam = ispuParams.value.reduce(
            (max, param) => {
              const val = latest[param.key] || 0;
              return val > max.value ? { key: param.key, value: val } : max;
            },
            { key: null, value: -Infinity }
          );

          lastData.datetime = latest.waktu;
          lastData.c_key = maxParam.key || "-";
          lastData.c_value = maxParam.value || 0;
        } else if (parsed.type === "WEATHER_UPDATE" && parsed.data) {
          const data = parsed.data.data?.[0] || parsed.data;
          weather.temp = data.temp;
          weather.humidity = data.humidity;
          weather.pressure = data.pressure;
          weather.wind_angle = data.wind_angle;
          weather.wspeed = data.wspeed;
          weather.tprecipitation = data.tprecipitation;
        }
      } catch (err) {
        console.error("Error parsing WebSocket message:", err);
      }
    });

    socket.addEventListener("close", () => {
      console.warn("WebSocket disconnected, reconnecting...");
      clearInterval(pingInterval);
      setTimeout(connectWebSocket, reconnectInterval);
    });

    socket.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
      socket.close();
    });
  }

  connectWebSocket();

  const numberOfBars = ispuParams.value.length;
  if (numberOfBars >= 1 && numberOfBars <= 5) {
    barBodyWidth.value = "72.1px";
    barWidth.value = "70px";
  } else {
    barBodyWidth.value = `${467 / numberOfBars}px`;
    barWidth.value = `${450 / numberOfBars}px`;
  }

  fetchData();
  fetchWeather();

  setInterval(() => {
    console.log("Refreshing data...");
    fetchData();
    fetchWeather();
  }, 30000);
});
</script>
