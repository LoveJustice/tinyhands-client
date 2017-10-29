let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ];

//1 = January
export default function () {
    return (monthNumber) => months[monthNumber - 1];
}