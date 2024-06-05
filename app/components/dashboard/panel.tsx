import { Button } from '@nextui-org/react';
import UserInfo from './user-info';

const buttons = [
  { label: 'Profesor' },
  { label: 'Aula' },
  { label: 'Materia' },
  { label: 'Edificio' },
  { label: 'Carrera' },
  { label: 'Importar/Exportar' },
];

const DashboardPanel = () => {
  return (
    <div className="flex w-[60%] flex-col gap-3 rounded-lg bg-lightPaper p-6 shadow-medium dark:bg-darkPaper">
      <UserInfo />
      <div className="flex items-center justify-between">
        <div className=" flex flex-col items-center justify-evenly gap-5">
          {buttons.map((button) => (
            <Button
              key={button.label}
              color="primary"
              className="h-12 w-36 text-white"
            >
              {button.label}
            </Button>
          ))}
        </div>
        <div className="w-full">
          <h1 className="text-center">Proximamente...</h1>
        </div>
      </div>
    </div>
  );
};

export default DashboardPanel;
