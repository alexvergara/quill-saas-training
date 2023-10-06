import { LucideProps, User } from 'lucide-react';
import { logos } from '@/resources/images/logos';

export const Icons = {
  user: User,
  logo: (props: LucideProps) => logos.logo1(props)
};
