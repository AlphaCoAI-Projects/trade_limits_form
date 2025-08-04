export interface IBollingerFormData {
  deviation: number | string
  timeFrame: number | string
}

export const EMPTY_BOLLINGER_FORM: IBollingerFormData = {
  deviation: "",
  timeFrame: "",
}