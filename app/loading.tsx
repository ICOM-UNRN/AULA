import { Spinner } from '@nextui-org/spinner';
export default function Loading() {
  return (
    <div className="flex flex-grow flex-col items-center justify-center p-6">
      <Spinner size="lg" color="primary" />
    </div>
  );
}
