import {onBeforeUnmount, ref} from "vue";
import {format} from "date-fns";

export const useCurrentTime = () => {
    const currentDateTime = ref(new Date());
    const currentDateTimeString = computed(()=>{
        return format(currentDateTime.value, 'MM/dd/yyyy hh:mm a')
    })
    const updateCurrentTime = () => {
        currentDateTime.value = new Date();
    };
    const updateTimeInterval = setInterval(updateCurrentTime, 1000);
    onBeforeUnmount(() => {
        clearInterval(updateTimeInterval);
    });
    return {
        currentDateTime, currentDateTimeString
    };
};
