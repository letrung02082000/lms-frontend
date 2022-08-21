import { MdArrowBack } from 'react-icons/md';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './titleBar.module.css';

function TitleBar(props) {
  const navigate = useNavigate();
  const location = useLocation();
  const bcolor = props.backgroundColor || '#019f91';

  const goBack = () => {
    if(props.path) {
      return navigate(props.path);
    }

    if (!location.key) {
      return navigate('/');
    }

    navigate(-1);
  };

  return (
    <div className={styles.titleBar} style={{ backgroundColor: bcolor }}>
      <button onClick={goBack} className={styles.goBackButton}>
        <MdArrowBack size={25} color='#fff' />
      </button>
      <p className={styles.pageTitle}>{props.title}</p>
    </div>
  );
}

export default TitleBar;
