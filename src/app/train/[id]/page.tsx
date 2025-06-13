import { Train } from '@/types/train';
import { getFirestore, collection, doc, getDoc } from 'firebase/firestore';


interface TrainPageProps {
  params: {
 id: string;
  };
}

 async function TrainPage({ params }: TrainPageProps) {
  const { id } = params;
  let train: Train | null = null;
  let error: string | null = null;
// try {
 const db = getFirestore();
 console.log('test1');
 const trainDocRef = doc(collection(db, 'train-data'), '366E016AE7D738E7E063DC4D1FACAEAD');
 const trainDocSnap = await getDoc(trainDocRef);
 console.log('test2');

 console.log(id)
 if (trainDocSnap.exists()) {
 train = trainDocSnap.data() as Train;
 } else {
 error = 'Train not found';
 }

  // } catch (err) {
//  error = 'Error fetching train data';
//  console.error(err);
//   }
//   if (error) {
//     return <div className="container mx-auto mt-8 px-4 text-center text-red-500">{error}</div>;
//   }

  if (!train) {
 return <div className="container mx-auto mt-8 px-4 text-center">Train data not available.</div>;
  }
  return (
    <div className="container mx-auto mt-8 px-4">
 <h1 className="text-2xl font-bold mb-4">Details for Train: {train.label || train.id}</h1>
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {/* Placeholder Image Section */}
 <div className="flex justify-center items-center bg-gray-200 h-64 rounded-md">
 <span className="text-gray-500">Placeholder Train Image</span>
 </div>
 {/* Train Details Section */}
 <div>
 <h2 className="text-xl font-semibold mb-2">Train Information</h2>
 <p><span className="font-medium">Train:</span>{train.routeId} Line | {train.label} | {train.id}</p>
 <p><span className="font-medium">Current Stop:</span> {train.currentStop?.name}</p>
 <p><span className="font-medium">Direction:</span> {train.directionName}</p>
 <p><span className="font-medium">Current Location:</span> {train.lat}, {train.lng}</p>
 {/* Add more train details as needed */}
 {train.timestamp && <p><span className="font-medium">Last Updated:</span> {new Date(train.timestamp).toLocaleString()}</p>}
 </div>
 </div>
    </div>
  );
};

export default TrainPage;