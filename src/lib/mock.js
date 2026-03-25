export const TRANSACTIONS = [
  { id:'EL-98214', customer:'Ayesha Malik',    email:'ayesha@mail.com',  phone:'0300-1234567', amount:124000, status:'completed', bank:'HBL',     time:'2 min ago',  date:'2026-03-24' },
  { id:'EL-98213', customer:'Usman Tariq',     email:'usman@mail.com',   phone:'0321-7654321', amount:48200,  status:'completed', bank:'Meezan',  time:'14 min ago', date:'2026-03-24' },
  { id:'EL-98212', customer:'Fatima Chaudhry', email:'fatima@mail.com',  phone:'0333-9876543', amount:9500,   status:'pending',   bank:'Alfalah', time:'28 min ago', date:'2026-03-24' },
  { id:'EL-98211', customer:'Bilal Hassan',    email:'bilal@mail.com',   phone:'0345-1112233', amount:21000,  status:'completed', bank:'MCB',     time:'1 hr ago',   date:'2026-03-24' },
  { id:'EL-98210', customer:'Sara Ahmed',      email:'sara@mail.com',    phone:'0311-4455667', amount:33400,  status:'completed', bank:'UBL',     time:'3 hrs ago',  date:'2026-03-24' },
  { id:'EL-98209', customer:'Kamran Raza',     email:'kamran@mail.com',  phone:'0322-8899001', amount:7800,   status:'failed',    bank:'ABL',     time:'5 hrs ago',  date:'2026-03-23' },
  { id:'EL-98208', customer:'Nadia Siddiqui',  email:'nadia@mail.com',   phone:'0301-2233445', amount:15600,  status:'refunded',  bank:'HBL',     time:'8 hrs ago',  date:'2026-03-23' },
  { id:'EL-98207', customer:'Tariq Mahmood',   email:'tariq@mail.com',   phone:'0312-5566778', amount:28900,  status:'completed', bank:'Faysal',  time:'1 day ago',  date:'2026-03-23' },
  { id:'EL-98206', customer:'Hira Khan',       email:'hira@mail.com',    phone:'0344-6677889', amount:42000,  status:'completed', bank:'Meezan',  time:'1 day ago',  date:'2026-03-23' },
  { id:'EL-98205', customer:'Zainab Ali',      email:'zainab@mail.com',  phone:'0323-7788990', amount:18500,  status:'on_hold',   bank:'HBL',     time:'2 days ago', date:'2026-03-22' },
];

export const REVENUE = [42000,65000,38000,91000,74000,110000,88000,95000,72000,130000,108000,145000,92000,167000];
export const DAYS    = ['Mar 11','Mar 12','Mar 13','Mar 14','Mar 15','Mar 16','Mar 17','Mar 18','Mar 19','Mar 20','Mar 21','Mar 22','Mar 23','Mar 24'];

export const BANKS = [
  { name:'HBL',     volume:245000, count:32 },
  { name:'Meezan',  volume:198000, count:27 },
  { name:'MCB',     volume:154000, count:21 },
  { name:'Alfalah', volume:132000, count:18 },
  { name:'UBL',     volume:98000,  count:14 },
  { name:'Faysal',  volume:76000,  count:11 },
];

export const REFUNDS = [
  { id:'REF-001', txId:'EL-98208', customer:'Nadia Siddiqui', amount:15600, reason:'Customer request',    status:'refunded', date:'2026-03-23', ref:'SP-REF-4421' },
  { id:'REF-002', txId:'EL-98201', customer:'Ali Khan',       amount:8900,  reason:'Damaged item',        status:'refunded', date:'2026-03-22', ref:'SP-REF-4388' },
  { id:'REF-003', txId:'EL-98196', customer:'Sana Mirza',     amount:22000, reason:'Wrong item delivered', status:'refunded', date:'2026-03-21', ref:'SP-REF-4312' },
];

export const ORDERS = TRANSACTIONS.map((t, i) => ({
  orderId:  `WC-${2400 + i}`,
  txId:     t.id,
  customer: t.customer,
  email:    t.email,
  city:     ['Karachi','Lahore','Islamabad','Multan','Faisalabad','Peshawar','Quetta','Sialkot','Rawalpindi','Gujranwala'][i % 10],
  items:    `${(i % 3) + 1} item${(i % 3) + 1 > 1 ? 's' : ''}`,
  total:    t.amount,
  status:   t.status,
  date:     t.date,
}));
