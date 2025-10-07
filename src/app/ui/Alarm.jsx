import { useEffect, useRef, useState } from "react";

export default function Alarm({alarmData}) {
  const [isResolved, setResolved] = useState(false);
  const closeRef = useRef();
  const modalRef = useRef();

  const resolveClick = (e) => {
    setResolved(true);
    alarmData.resolve(e.target.getAttribute('status'));
    setTimeout(() => {
      closeRef.current.click(); 
      setResolved(false);
    }, 4);
  };

  const rejectClick = () => {
    if(!isResolved) {
      alarmData.reject();
    }
  };

  useEffect(() => {
      modalRef.current.addEventListener('hide.bs.modal', rejectClick);
      return () => {
          if(modalRef.current) {
              modalRef.current.removeEventListener('hide.bs.modal', rejectClick);
          }
      }
  }, [alarmData]);

  const btnClasses = ["btn-primary", "btn-secondary", "btn-success", "btn-info"];

  return <div ref={modalRef} className="modal fade" id="alarmModal" tabIndex="-1" aria-labelledby="alarmModalLabel" aria-hidden="true">
  <div className="modal-dialog">
    <div className="modal-content">
      <div className="modal-header">
        <h1 className="modal-title fs-5" id="alarmModalLabel">{alarmData.title}</h1>
        <button onClick={rejectClick} ref={closeRef} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div className="modal-body">
        {alarmData.message}
      </div>
      <div className="modal-footer">
        {typeof alarmData.buttons == 'object' && alarmData.buttons.map((btn, index) => 
            <button
                key={btn.status} 
                status={btn.status} 
                onClick={resolveClick} 
                type="button" 
                className={"btn " + btnClasses[index]}>
                    {btn.title}
            </button>)
        }
        </div>
    </div>
  </div>
</div>;
}
/*
Д.З. Програмні повідомлення (Alarm):
додати контроль за тим, що кількість кнопок не перевищує кількість стилів для них
(повторювати стилі якщо кнопок виявиться більше)
додати співвідношення типів (статусів) кнопок та стилей, передбачити пріоритет:
якщо є стиль за статусом, то застосувати його, якщо немає, то брати з 
масиву-переліку.


Додати до параметрів повідомлень інформацію про "іконку"
icon: "info" / "warning" / "stop"
у відповідності до типу можна виводити іконки:
"info" <i class="bi bi-info-circle"></i>
"warning" <i class="bi bi-exclamation-triangle"></i>
"stop" <i class="bi bi-sign-stop"></i>
Передбачити можливість відсутності іконки (нічого не виводити)
* забезпечити кольорове оформлення іконок
*/