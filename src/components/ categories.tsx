 import BottomNav from '../components/BottomNav';
 import { useSelector } from 'react-redux'; 
    import type { RootState } from '../store';

export default function Categories() {
  const items = useSelector((state: RootState) => state.app.items);
    const categoriesList = ['Groceries', 'Bakery', 'Fruits', 'Snacks'];

      return (
          <div className="max-w-md mx-auto min-h-screen bg-gray-50 pb-24 px-4 pt-6">
            <h2 className="text-xl font-bold mb-4">Categories</h2>
              <div className="grid grid-cols-2 gap-4">
              {categoriesList.map(cat => {
              const count = items.filter(i => i.category === cat).length;
              return (
              <div key={cat} className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm">
              <span className="text-2xl block mb-2">📁</span>
            <h4 className="font-bold text-gray-800">{cat}</h4>
            <p className="text-xs text-gray-400 mt-1">{count} items saved</p>
            </div>
            );
           })}
          </div>
          <BottomNav />
           </div>  
            );
            }
                                                                                                                                                        //  