import 'normalize.css';
import style from './GlobalStyle.module.scss';

function GlobalStyle({ children }) {
    return <div className={style.wrapper}>{children}</div>;
}