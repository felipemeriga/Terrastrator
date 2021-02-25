
export function updateTick(message) {
    return {
        type: 'TICK',
        payload: message
    };
}
