import TitleBar from 'shared/components/TitleBar'

export function NotFoundPage() {
  return (
    <>
      {/* <TitleBar title="Lỗi" /> */}
      <div
        style={{
          textAlign: 'center',
          minHeight: '70vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <p>Xin lỗi, không tìm thấy trang này</p>
      </div>
    </>
  )
}
