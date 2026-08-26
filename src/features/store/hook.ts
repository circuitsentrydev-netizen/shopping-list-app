import { useDispatch, useSelector } from 'react-redux';
// 1. Corrected the path to use a relative dot-slash notation
import type { AppDispatch, RootState } from './store'   

// 2. Added parentheses () to invoke the factory method correctly
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
