import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';

// Tạo transporter để gửi email
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Lưu trữ OTP tạm thời (trong thực tế nên lưu vào database)
const otpStore = new Map<string, { otp: string; expires: number }>();

// Tạo OTP ngẫu nhiên
const generateOTP = () => {
    return randomBytes(3).toString('hex').toUpperCase();
};

export async function POST(request: Request) {
    try {
        const { email, otp, newPassword } = await request.json();
        const API_URL = "https://api-mnyt.purintech.id.vn/api/Authentication";

        // Nếu chỉ có email, gửi OTP
        if (email && !otp && !newPassword) {
            // Kiểm tra email tồn tại trong database
            const response = await fetch(`${API_URL}/check-email`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                return NextResponse.json(
                    { success: false, message: 'Email không tồn tại trong hệ thống' },
                    { status: 404 }
                );
            }

            // Tạo OTP
            const otp = generateOTP();
            const expires = Date.now() + 15 * 60 * 1000; // OTP hết hạn sau 15 phút
            otpStore.set(email, { otp, expires });

            // Gửi email
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Mã xác nhận đặt lại mật khẩu',
                html: `
                    <h1>Đặt lại mật khẩu</h1>
                    <p>Mã xác nhận của bạn là: <strong>${otp}</strong></p>
                    <p>Mã này sẽ hết hạn sau 15 phút.</p>
                    <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                `
            };

            await transporter.sendMail(mailOptions);

            return NextResponse.json(
                { success: true, message: 'Đã gửi mã xác nhận đến email của bạn' },
                { status: 200 }
            );
        }

        // Nếu có email và OTP, xác thực OTP
        if (email && otp && !newPassword) {
            const storedData = otpStore.get(email);

            if (!storedData) {
                return NextResponse.json(
                    { success: false, message: 'Không tìm thấy mã xác nhận' },
                    { status: 400 }
                );
            }

            if (Date.now() > storedData.expires) {
                otpStore.delete(email);
                return NextResponse.json(
                    { success: false, message: 'Mã xác nhận đã hết hạn' },
                    { status: 400 }
                );
            }

            if (storedData.otp !== otp) {
                return NextResponse.json(
                    { success: false, message: 'Mã xác nhận không chính xác' },
                    { status: 400 }
                );
            }

            return NextResponse.json(
                { success: true, message: 'Xác thực mã thành công' },
                { status: 200 }
            );
        }

        // Nếu có đầy đủ thông tin, đặt lại mật khẩu
        if (email && otp && newPassword) {
            const storedData = otpStore.get(email);

            if (!storedData || storedData.otp !== otp || Date.now() > storedData.expires) {
                return NextResponse.json(
                    { success: false, message: 'Mã xác nhận không hợp lệ' },
                    { status: 400 }
                );
            }

            // Gọi API đặt lại mật khẩu
            const response = await fetch(`${API_URL}/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, newPassword }),
            });

            if (!response.ok) {
                return NextResponse.json(
                    { success: false, message: 'Không thể đặt lại mật khẩu' },
                    { status: 500 }
                );
            }

            // Xóa OTP đã sử dụng
            otpStore.delete(email);

            return NextResponse.json(
                { success: true, message: 'Đặt lại mật khẩu thành công' },
                { status: 200 }
            );
        }

        return NextResponse.json(
            { success: false, message: 'Thiếu thông tin' },
            { status: 400 }
        );

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json(
            { success: false, message: 'Có lỗi xảy ra' },
            { status: 500 }
        );
    }
} 