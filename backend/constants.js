module.exports = {
    DATA_DB_NAME:"orphanWaveIndicators",
    DATA_DB_URL:"mongodb://localhost:27017/",
    BASE_IEX_URL:"https://cloud.iexapis.com/stable/",
    RELEASE_DATE_STR:"releaseDate",
    LOCAL_PORT:8000,
    HOST_NAME:"127.0.0.1",

    ROUTES:{
      GET_IEX_STATUS:"/status"
    },

    IEX:{
      STATUS_ROUTE:"status",
      NOT_AVAILABLE_MESSAGE:"IEX Not active",
      CPI_ROUTE:"data-points/market/CPIAUCSL",
      UNEMPLOYMENT_RATE_DATAPOINTS_ROUTE:"/data-points/market/UNRATE",
      TOKEN_ARGUMENT:"?token=",
      UNEMPLOYMENT_RATE_ROUTE:"time-series/economic/UNRATE"
    }
};
