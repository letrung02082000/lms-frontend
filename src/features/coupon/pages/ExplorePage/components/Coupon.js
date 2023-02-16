import styled from "styled-components";

const Coupon = (props) => {
  const {
    couponStyle = "long",
    couponTitle,
    couponDiscount,
    couponMaxQuantity,
    couponCurrentQuantity,
    useCoupon,
  } = props;

  const trimText = (text, length) => {
    if (text.length > length) {
      return text.substring(0, length - 3) + "...";
    }
    return text;
  };

  return (
    (couponStyle === "long" && (
      <Style>
        <div className="longCoupon">
          <div className="couponLeftSection">
            <span>{trimText(couponTitle, 20)}</span>
            <span>
              Thanh toán hoá đơn giảm{" "}
              <span style={{ fontWeight: 600 }}>{couponDiscount}</span>
            </span>
          </div>
          <div className="couponRightSection">
            <div>
              <span>{couponCurrentQuantity}</span>
              <span>/</span>
              <span>{couponMaxQuantity}</span>
            </div>
            <button onClick={useCoupon}>Xem ngay!</button>
          </div>
        </div>
      </Style>
    )) ||
    (couponStyle === "short" && (
      <Style>
        <div className="shortCoupon">
          <div className="couponUpperSection">
            <span>{trimText(couponTitle, 12)}</span>
            <span>
              Thanh toán hoá đơn giảm{" "}
              <span style={{ fontWeight: 600 }}>{couponDiscount}</span>
            </span>
          </div>
          <div className="couponLowerSection">
            <div>
              <span>{couponCurrentQuantity}</span>
              <span>/</span>
              <span>{couponMaxQuantity}</span>
            </div>
            <button onClick={useCoupon}>Xem ngay!</button>
          </div>
        </div>
      </Style>
    ))
  );
};

const Style = styled.div`
  .longCoupon {
    display: flex;
    flex-direction: row;
    height: 150px;
  }

  .longCoupon > .couponLeftSection {
    display: flex;
    z-index: 1;
    padding: 1rem;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    background-color: #f9f9f9;
    border-radius: 0.75rem 0 0 0.75rem;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
    min-width: 250px;
    max-width: 400px;

    -webkit-mask-image: radial-gradient(
        circle at right 0px bottom 10px,
        transparent 10px,
        red 10.5px
      ),
      linear-gradient(transparent 25%, red 0, red 75%, transparent 0);
    -webkit-mask-size: 100%, 5px 24px;
    -webkit-mask-repeat: repeat, repeat-y;
    -webkit-mask-position: 0 10px, calc(100% - -2.5px);
    -webkit-mask-composite: source-out;
    mask-composite: subtract;

    >span: {
      color: var(--primary);
    }
    > span:first-child {
      font-size: 18px;
      font-weight: 600;
    }
    > span:last-child {
      font-size: 24px;
      font-weight: 400;
    }
  }

  .longCoupon > .couponRightSection {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    height: 100%;
    justify-content: center;
    align-items: center;
    background-color: #f9f9f9;
    border-radius: 0 0.75rem 0.75rem 0;

    -webkit-mask-image: radial-gradient(
        circle at 0px 10px,
        transparent 10px,
        red 10.5px
      ),
      linear-gradient(transparent 25%, red 0, red 75%, transparent 0);
    -webkit-mask-size: 100%, 5px 24px;
    -webkit-mask-repeat: repeat, repeat-y;
    -webkit-mask-position: 0 -10px, -2.5px;
    -webkit-mask-composite: source-out;
    mask-composite: subtract;

    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);

    > div > span {
      font-size: 24px;
      font-weight: 600;
      color: #000;
    }
    > div > span:nth-child(2) {
      margin: 0 0.5rem;
    }
    > div > span:last-child {
      color: var(--primary);
    }
    > button {
      padding: 0.5rem 1rem;
      border-radius: 0.5rem;
      border: none;
      background-color: var(--primary);
      color: #fff;
      font-size: 18px;
      font-weight: 600;
      cursor: pointer;
    }
  }

  .shortCoupon {
    display: flex;
    flex-direction: column;
    width: 175px;
  }

  .shortCoupon > .couponUpperSection {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background-color: #f9f9f9;
    border-radius: 0.75rem 0.75rem 0 0;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
    -webkit-mask-image: radial-gradient(
        circle at right 10px bottom 0px,
        transparent 10px,
        red 10.5px
      ),
      linear-gradient(90deg, transparent 25%, red 0, red 75%, transparent 0);
    -webkit-mask-size: 100%, 24px 5px;
    -webkit-mask-repeat: repeat, repeat-x;
    -webkit-mask-position: 10px, 50% calc(100% - -2.5px);
    -webkit-mask-composite: source-out;
    mask-composite: subtract;

    >span: {
      color: var(--primary);
    }
    > span:first-child {
      font-size: 20px;
      font-weight: 600;
    }
    > span:last-child {
      font-size: 18px;
      font-weight: 400;
    }
  }

  .shortCoupon > .couponLowerSection {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    padding: 1rem;
    background-color: #f9f9f9;
    border-radius: 0 0 0.75rem 0.75rem;
    box-shadow: 0 0 8px 0 rgba(0, 0, 0, 0.1);
    -webkit-mask-image: radial-gradient(
        circle at 10px 0px,
        transparent 10px,
        red 10.5px
      ),
      linear-gradient(90deg, transparent 25%, red 0, red 75%, transparent 0);
    -webkit-mask-size: 100%, 24px 5px;
    -webkit-mask-repeat: repeat, repeat-x;
    -webkit-mask-position: -10px, 50% -2.5px;
    -webkit-mask-composite: source-out;
    mask-composite: subtract;

    > div > span {
      font-size: 20px;
      font-weight: 600;
      color: #000;
    }
    > div > span:nth-child(2) {
      margin: 0 0.25rem;
    }
    > div > span:last-child {
      color: var(--primary);
    }
  }

  .shortCoupon > .couponLowerSection > button {
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    border: none;
    background-color: var(--primary);
    color: #fff;
    font-size: 18px;
    font-weight: 600;
    cursor: pointer;
  }
`;

export default Coupon;
