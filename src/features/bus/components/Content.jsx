import styled from 'styled-components'
import React from 'react'
import ZaloLink from 'components/link/ZaloLink'

function Content() {
  return (
    <Styles>
      <h1>“Thảnh thơi di chuyển - Đã có Shuttle Bus VNU HCMC lo”</h1>
      <div>
        Nếu các bạn sinh viên đang lưu trú ở những quận cách xa Khu đô thị Đại học Quốc Gia TP.HCM nhưng vẫn muốn di
        chuyển đến những địa điểm ở trong đó như: các trường Đại học, Thư viện trung tâm, Nhà khách, Nhà điều hành,..,
        tuy nhiên, các bạn lo ngại rằng việc di chuyển bằng phương tiện cá nhân sẽ gây tốn kém trong thời điểm giá xăng
        đang tăng cao, cũng như việc lái xe ở một khoảng cách xa sẽ không đảm bảo được sự an toàn cho bản thân.
        <br />
        <br />
        Hoặc các bạn muốn đi lại bằng xe buýt để bảo vệ môi trường, mỗi bạn 1 ghế, không chen lấn, không sợ bị quấy rối
        và các bạn mong muốn được di chuyển theo một lộ trình nhất định từ nhà đến điểm cần tới mà không phải dừng ở
        nhiều trạm để tiết kiệm thời gian nhất có thể.
        <br />
        <br />
        Với tất cả những mong mỏi của các bạn sinh viên ở trên thì Shuttle Bus VNU HCMC là một dịch vụ tuyệt hảo chỉ đưa
        đón các bạn sinh viên, di chuyển với lộ trình nhất định, giá thành hợp lý, giúp các bạn tiết kiệm thời gian, an
        toàn, tránh mưa nắng, khói bụi và hình thành được lối sống xanh, bảo vệ môi trường. Rất nhiều lợi ích đáng kể
        khi chúng ta tham gia giao thông bằng Shuttle Bus VNU HCMC. Vì vậy, còn chần chờ gì nữa mà không nhanh tay điền
        vào link khảo sát sau đây để mỗi chúng ta trong cộng đồng sinh viên sẽ sớm được trải nghiệm dịch vụ tiện ích
        này.
        <br />
        <br />
        Rất nhiều lợi ích đáng kể khi chúng ta tham gia giao thông bằng Shuttle Bus VNU HCMC. Đăng ký ngay tại đây hoặc
        liên hệ hotline: <ZaloLink tel="0877876877" /> để được tư vấn chi tiết về các gói dịch vụ.
      </div>
    </Styles>
  )
}

export default Content

const Styles = styled.div`
  text-align: justify;
  background-color: white;
  padding: 15px;
  margin: 1rem 0;
  border-radius: 15px;
`
