const genDrivingQuickMessage = (name, dateInfo, isPaid) => {
    const paymentMessage = isPaid ? '' : ` Nếu chưa thanh toán lệ phí, bạn vui lòng hoàn tất trong hôm nay theo hướng dẫn tại ${window.location.origin + dateInfo?.center?.instructionLink}.`;
    return `Chào bạn ${name}, mình gửi bạn nhóm thi ${dateInfo?.description}. Bạn vui lòng tham gia nhóm thi tại ${dateInfo?.link} để nhận thông báo dự thi.${isPaid ? '' : paymentMessage} Cảm ơn bạn.`;
}
const genInvalidPortraitMessage = (name) => `Chào bạn ${name}, ảnh chân dung của bạn chưa hợp lệ. Bạn vui lòng chụp lại ảnh chân dung gửi lại qua zalo kèm sđt trong hôm nay giúp mình.
- Lấy đủ 2 vai, từ thắt lưng, không sử dụng filter, trang phục lịch sự
- Không đeo kính
- Không mờ, chói loá
- Tóc không che trán, vén ra sau mang tai
- Ảnh chụp không quá 3 tháng
- Có thể chụp bằng điện thoại, chụp bằng cam sau.
Xem ảnh mẫu tại đây: https://imgur.com/a/v4yj22w`;

const genInvalidCardMessage = (name) => `Chào bạn ${name}, bạn chụp lại 2 mặt CCCD giúp mình nhé.`;

export { genDrivingQuickMessage, genInvalidPortraitMessage, genInvalidCardMessage };
