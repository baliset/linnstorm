import {DateTime} from 'luxon';
import {TIME_24_WITH_SECONDS} from "luxon/src/impl/formats";

export const tsToTime = (ts) => DateTime.fromMillis(ts).toLocaleString(TIME_24_WITH_SECONDS);
export const tsToDate = (ts) => DateTime.fromMillis(ts).toLocaleString('yyyy-LL-dd');
