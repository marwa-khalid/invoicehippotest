import { toast, ToastOptions, Id } from 'react-toastify';
import { TraceInfoType } from './_models';

// Utility function to handle errors
export function handleToast(response:any) {
    let message = response.messages[0]?.message
    let messageType = response.messages[0]?.type;

    if (response && response.messages && response.messages.length > 0) {
        message = response.messages[0].message;
        messageType = response.messages[0].type;
    } else if (response instanceof Error) {
        message = response.message;
    }

    // Define toast options based on message type
    function getToastOptions(messageType: number): { type: string; color: string } {
        switch (messageType) {
        case TraceInfoType.Debug:
            return { type: 'info', color: 'grey' };
        case TraceInfoType.Success:
            return { type: 'success', color: 'green' };
        case TraceInfoType.Information:
            return { type: 'info', color: 'blue' };
        case TraceInfoType.Warning:
            return { type: 'warning', color: 'orange' };
        case TraceInfoType.Error:
            return { type: 'error', color: 'red' };
        case TraceInfoType.Critical:
            return { type: 'error', color: 'red' };
        case TraceInfoType.Fatal:
            return { type: 'error', color: 'red' };
        case TraceInfoType.UpgradeError:
            return { type: 'error', color: 'red' };
        case TraceInfoType.Upgrade:
            return { type: 'info', color: 'blue' };
        default:
            return { type: 'error', color: 'black' }; 
        }
    }

    const { type, color } = getToastOptions(messageType);
    
    const toastFunction = toast[type as keyof typeof toast] as (message: string, options?: ToastOptions) => Id;
    toastFunction(message);

    if(response.hasErrors){
        throw new Error(message);
    }else{
        return
    }
}
