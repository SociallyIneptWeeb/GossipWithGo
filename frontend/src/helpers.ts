import { formatDistance } from "date-fns"

export function TimeFromNow(timestamp: string) {
  return formatDistance(Date.parse(timestamp), new Date(), { addSuffix: true })
}

export function ToDateString(timestamp: string) {
  return new Date(timestamp).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric"})
}
