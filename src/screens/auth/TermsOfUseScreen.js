import React from 'react';
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  StatusBar,
  ScrollView,
} from 'react-native';
import BackButton from '../../components/BackButton';
import Button from '../../components/SubmitButton';
export default function TermsOfUseScreen({navigation}) {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="white" />
      <BackButton onPressHandler={navigation.goBack} color="#FEC54B" />
      <SafeAreaView style={styles.container}>
        <View style={styles.logoArea}>
          <View style={styles.logo}>
            <Image
              style={styles.imageLogo}
              source={require('../../../assets/images/logo/logo.png')}
            />
          </View>
        </View>
        <Text style={styles.headerText}>Điều khoản sử dụng dịch vụ</Text>
        <ScrollView>
          <View>
            <Text style={styles.titleText}>1. Giới thiệu</Text>
            <Text>{''}</Text>
            <Text>
              &nbsp; &nbsp;Chào mừng thợ sửa chữa đến với FLIX - Ứng dụng tìm
              việc sửa chữa tiện ích, nhanh chóng.
            </Text>
            <Text>
              &nbsp; &nbsp;Khi người dùng đăng ký tài khoản vào hệ thống của
              chúng tôi có nghĩa là người dùng đã đồng ý với các điều khoản này.
              Ứng dụng có quyền thay đổi, chỉnh sửa, thêm hoặc lược bỏ bất kỳ
              phần nào trong Điều khoản này, vào bất cứ lúc nào. Và khi người
              dùng tiếp tục sử dụng ứng dụng, sau khi các thay đổi về Điều khoản
              được đăng tải, có nghĩa là người dùng chấp nhận với những thay đổi
              đó.
            </Text>
            <Text>
              &nbsp; &nbsp;Người dùng vui lòng kiểm tra thường xuyên để cập nhật
              những thay đổi của chúng tôi.
            </Text>
            <Text>{''}</Text>
            <Text style={styles.titleText}>2. Ý kiến của người dùng</Text>
            <Text>{''}</Text>
            <Text>
              &nbsp; &nbsp;Tất cả ý kiến đóng góp về hệ thống của người dùng đều
              là tài sản của chúng tôi. Nếu chúng tôi phát hiện bất kỳ thông tin
              giả mạo hay sai lệch nào, chúng tôi sẽ khóa tài khoản của người
              dùng ngay lập tức hoặc áp dụng các biện pháp khác theo quy định
              của pháp luật Việt Nam.
            </Text>
            <Text>{''}</Text>
            <Text style={styles.titleText}>
              3. Nhận yêu cầu của khách hàng và hủy bỏ yêu cầu
            </Text>
            <Text>{''}</Text>
            <Text>
              &nbsp; &nbsp;Để có thể nhận yêu cầu của khách hàng, thợ sửa chữa
              cần đảm bảo duy trì ít nhất 200.000 vnđ trong tài khoàn hệ thống,
              để có thể trả tiền phạt nếu vi phạm Điều khoản về hủy bỏ yêu cầu
              muộn.
            </Text>
            <Text>
              &nbsp; &nbsp;Để đảm bảo tính chính xác của yêu cầu, trước khi nhận
              yêu cầu của khách hàng, thợ sửa chữa cần kiểm tra thật kĩ thông
              tin yêu cầu về địa chỉ, tình trạng hỏng hóc cần sửa chữa và thời
              gian cần sửa chữa.
            </Text>
            <Text>
              &nbsp; &nbsp;Thợ sửa chữa được phép hủy bỏ yêu cầu trong trạng
              thái Đã xác nhận, ngoài ra không thể hủy yêu cầu của khách hàng.
              Nếu hủy bỏ yêu cầu trước thời gian sửa chữa yêu cầu trong vòng 1
              tiếng, thợ sửa chữa sẽ bị kỉ luật với mức phạt 20.000 vnđ vào số
              dư tài khoản.
            </Text>
            <Text>{''}</Text>
            <Text style={styles.titleText}>4. Tạo hóa đơn</Text>
            <Text>{''}</Text>
            <Text>
              &nbsp; &nbsp;Thợ sửa chữa cần đảm bảo có đủ tiền trong số dư tài
              khoản để có thể tạo hóa đơn thanh toán cho khách hàng. Số tiền này
              cần thiết để trả phí hoa hồng cho hệ thống(20% tổng phí dịch vụ
              chi tiết và dịch vụ ngoài trong hóa đơn, không tính phí linh
              kiện), cho thuế VAT(5% tổng hóa đơn trước khi khấu hao do phiếu
              giảm giá), cũng như trả tiền phạt nếu thợ sửa chữa vi phạm Điều
              khoản.
            </Text>
            <Text>
              &nbsp; &nbsp;Sau khi đã khấu hao những khoản phí cần thiết bao gồm
              phí hoa hồng cho hệ thống (20% tổng phí dịch vụ chi tiết và dịch
              vụ ngoài trong hóa đơn, không tính phí linh kiện) và phí VAT 5%
              theo quy định của pháp luật Việt Nam căn cứ Điều 9 Thông tư
              219/2013/TT-BTC, tài khoản của thợ sẽ được nhận khoản tiền tương
              ứng nếu hóa đơn được thanh toán qua VNPAY, hoặc thợ sẽ nhận tiền
              mặt của khách hàng nếu hóa đơn thanh toán bằng tiền mặt. Nếu có gì
              sai xót trong quá trình giao dịch, vui lòng liên hệ qua hotline
              hoặc gửi phản hồi lên hệ thống để được hỗ trợ sớm nhất.
            </Text>
            <Text>{''}</Text>
            <Text style={styles.titleText}>5. Đảm bảo chất lượng sửa chữa</Text>
            <Text>{''}</Text>
            <Text>
              &nbsp; &nbsp;Trong quá trình sửa chữa, thợ sửa cần yêu cầu khách
              hàng quay lại quá trình sửa chữa của mình để đảm bảo tính công
              bằng và an toàn. Nếu khách hàng báo cáo gian lận trong thay thế
              linh kiện, hay sửa chữa không đảm bảo chất lượng qua phản hồi,
              chúng tôi sẽ liên lạc với thợ sửa chữa ngay lập tức, nếu phát hiện
              báo cáo là đúng sẽ khóa tài khoản của thợ sửa chữa ngay lập tức
              hoặc áp dụng các biện pháp khác theo quy định của pháp luật Việt
              Nam.
            </Text>
            <Text>{''}</Text>
            <Text style={styles.titleText}>
              6. Thanh toán an toàn và tiện lợi
            </Text>
            <Text>{''}</Text>
            <Text>
              &nbsp; &nbsp;Thợ sửa chữa có thể nạp và rút tiền bằng những phương
              thức thanh toán sau đây và lựa chọn áp dụng phương thức phù hợp:
            </Text>
            <Text>{''}</Text>
            <Text style={styles.titleText}>
              &nbsp; &nbsp;Cách 1: Thanh toán qua VNPAY (Cả nạp và rút tiền)
            </Text>
            <Text>{''}</Text>
            <Text style={styles.titleText}>&nbsp; &nbsp;Đối với nạp tiền:</Text>
            <Text>
              &nbsp; &nbsp; &nbsp;Bước 1: Thợ vào phần Nạp tiền vào tài khoản,
              nhập số tiền cần nạp vào trong tài khoản, chọn hình thức qua VNPAY
              rồi bấm Nạp tiền(Yêu cầu thợ sửa chữa cài đặt ứng dụng thanh toán
              VNPAY, nếu không có thì sẽ được chuyển tiếp đến cửa hàng cài đặt).
            </Text>
            <Text>
              &nbsp; &nbsp; &nbsp;Bước 2: Thợ sửa chữa sẽ được chuyển tiếp đến
              ứng dụng thanh toán VNPAY, vui lòng điền đầy đủ thông tin cần
              thiết để thực hiện giao dịch nạp tiền vào hệ thống.
            </Text>
            <Text>
              &nbsp; &nbsp; &nbsp;Bước 3: Sau khi thanh toán thành công, tài
              khoản hệ thống FLIX sẽ hiện thông báo nạp tiền vào tài khoản cũng
              như cộng vào số dư đã có, thợ sửa chữa có thể kiểm tra lại giao
              dịch nạp tiền của mình khi truy cập vào Biến động số dư.
            </Text>
            <Text>{''}</Text>
            <Text style={styles.titleText}>&nbsp; &nbsp;Đối với rút tiền:</Text>
            <Text>
              &nbsp; &nbsp; &nbsp;Bước 1: Thợ vào phần Yêu cầu rút tiền, nhập số
              tiền cần rút và chọn hình thức qua VNPAY.
            </Text>
            <Text>
              &nbsp; &nbsp; &nbsp;Bước 2: Nhập tên ngân hàng, số tài khoản, tên
              tài khoản để gửi yêu cầu lên hệ thống.
            </Text>
            <Text>
              &nbsp; &nbsp; &nbsp;Bước 3: Quản trị viên hệ thống sau khi xem xét
              và chấp nhận yêu cầu rút tiền, hệ thống sẽ gửi thông báo cho thợ
              sửa chữa cũng như cộng tiền vào tài khoản VNPAY theo yêu cầu rút
              tiền của thợ.
            </Text>
            <Text>{''}</Text>
            <Text style={styles.titleText}>
              &nbsp; &nbsp;Cách 2: Thanh toán qua tiền mặt (Chỉ dành cho rút
              tiền)
            </Text>
            <Text>{''}</Text>
            <Text>
              &nbsp; &nbsp; &nbsp;Bước 1: Thợ vào phần Yêu cầu rút tiền, nhập số
              tiền cần rút và chọn hình thức qua tiền mặt
            </Text>
            <Text>
              &nbsp; &nbsp; &nbsp;Bước 2: Thợ cần đến trụ sở của FLIX, yêu cầu
              mang theo CMND/CCCD và mã giao dịch hệ thống để xác nhận giao dịch
              rút tiền.
            </Text>
            <Text>{''}</Text>
            <Text style={styles.titleText}>
              7. Đảm bảo an toàn về giao dịch tại FLIX
            </Text>
            <Text>{''}</Text>
            <Text>
              &nbsp; &nbsp;Chúng tôi sử dụng các dịch vụ để bảo về thông tin
              giao dịch trong hệ thống, đồng thời lưu trữ thông tin giao dịch
              của người dùng. Để đảm bảo các giao dịch được tiến hành thành
              công, hạn chế rủi ro có thể phát sinh.
            </Text>
            <Text>
              &nbsp; &nbsp;Trong trường hợp liên quan đến lỗi giao dịch, vui
              lòng liên hệ qua hotline hoặc gửi phản hồi cho hệ thống. Chúng tôi
              sẽ liên hệ giải quyết sớm nhất cho người dùng và hoàn lại tiền nếu
              xác nhận lỗi thuộc trách nghiệm của chúng tôi.
            </Text>
            <Text>{''}</Text>
            <Text style={styles.titleText}>8. Phản hồi hệ thống</Text>
            <Text>{''}</Text>
            <Text>
              &nbsp; &nbsp;Nếu gặp vấn đề gì liên quan đến hệ thống, tài khoản,
              giao dịch, ...Vui lòng vào mục Yêu cầu hỗ trợ, điền đầy đủ thông
              tin cần thiết. Chúng tôi sẽ liên hệ trong thời gian sớm nhất để xử
              lý hoặc thông báo thông qua số điện thoại đăng ký trong hệ thống.
            </Text>
          </View>
        </ScrollView>
        <Button
          style={{
            marginVertical: 8,
            width: '100%',
            alignSelf: 'center',
          }}
          onPress={navigation.goBack}
          buttonText="ĐỒNG Ý"
        />
      </SafeAreaView>
    </>
  );
}
const styles = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: '4%', backgroundColor: 'white'},
  logoArea: {
    height: '30%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 30,
  },
  logo: {
    width: '32%',
    aspectRatio: 1,
  },
  imageLogo: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  headerText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 20,
  },
  titleText: {
    fontWeight: 'bold',
    color: 'black',
  },
});
