# 🥥 NatuCoconut — Tamil Nadu's Finest Coconut Store

A full-stack e-commerce application for selling coconut products with delivery across all 38 districts of Tamil Nadu.

---

## 🏗️ Tech Stack

| Layer     | Tech                        |
|-----------|-----------------------------|
| Frontend  | React 18, React Router v6   |
| Backend   | Node.js, Express.js         |
| Database  | MySQL 8.0                   |
| Auth      | JWT + bcrypt                |
| Container | Docker + Docker Compose     |
| K8s       | Kubernetes + NGINX Ingress  |

---

## 📦 Project Structure

```
coconut-store/
├── frontend/          # React app
│   ├── src/
│   │   ├── pages/     # Home, Products, Cart, Checkout, MyOrders, Admin
│   │   ├── components/# Navbar, ProductCard
│   │   ├── context/   # AuthContext, CartContext
│   │   └── utils/     # API axios instance
│   ├── nginx.conf
│   └── Dockerfile
├── backend/           # Express API
│   ├── routes/        # auth, products, orders, admin
│   ├── middleware/    # JWT auth
│   ├── models/        # MySQL pool
│   └── Dockerfile
├── mysql-init/        # SQL seed file
│   └── init.sql
├── k8s/               # Kubernetes manifests
│   ├── secrets.yaml
│   ├── mysql-deployment.yaml
│   ├── backend-deployment.yaml
│   ├── frontend-deployment.yaml
│   └── ingress.yaml
└── docker-compose.yml
```

---

## 🚀 Run with Docker Compose

```bash
# 1. Clone / enter project
cd coconut-store

# 2. Build and start all services
docker-compose up --build

# 3. Open browser
http://localhost:3000
```

### Services started:
| Service  | Port  |
|----------|-------|
| Frontend | 3000  |
| Backend  | 5000  |
| MySQL    | 3306  |

---

## 👤 Default Credentials

| Role     | Mobile       | Password  |
|----------|-------------|-----------|
| Admin    | 9999999999  | admin123  |

---

## 🛒 User Flow

1. **Register** → name, mobile number, password
2. **Browse Products** → search/filter by category
3. **Add to Cart** → manage quantities
4. **Checkout** → enter Tamil Nadu delivery address (38 districts)
5. **Payment** → dummy payment form (Stripe integration ready)
6. **Order Confirmation** → order ID and delivery info

## 🔧 Admin Flow

1. Login with admin credentials → redirected to Admin Panel
2. View **dashboard stats** (orders, revenue, customers)
3. **Filter orders** by status
4. **Expand any order** → see full delivery address + items
5. **Update order status** → placed → processing → shipped → delivered
6. See courier partner suggestions for dispatch

---

## ☸️ Kubernetes Deployment

### Prerequisites
- Kubernetes cluster (minikube, k3s, EKS, GKE, etc.)
- NGINX Ingress Controller installed
- Images built and available in your registry

### Step 1: Build & push images
```bash
# Build images
docker build -t coconut-backend:latest ./backend
docker build -t coconut-frontend:latest ./frontend

# If using minikube
eval $(minikube docker-env)
docker build -t coconut-backend:latest ./backend
docker build -t coconut-frontend:latest ./frontend

# If using a registry (replace with your registry)
docker tag coconut-backend:latest your-registry/coconut-backend:latest
docker tag coconut-frontend:latest your-registry/coconut-frontend:latest
docker push your-registry/coconut-backend:latest
docker push your-registry/coconut-frontend:latest
```

### Step 2: Deploy to K8s
```bash
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/mysql-deployment.yaml

# Wait for MySQL to be ready
kubectl wait --for=condition=ready pod -l app=mysql --timeout=120s

kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

### Step 3: Access the app
```bash
# With minikube
minikube ip
# Add to /etc/hosts: <minikube-ip> coconut.local
# Visit: http://coconut.local

# Port-forward (testing)
kubectl port-forward service/frontend 3000:80
kubectl port-forward service/backend 5000:5000
```

### Check status
```bash
kubectl get pods
kubectl get services
kubectl get ingress
kubectl logs -l app=coconut-backend
```

---

## 🌴 Products

| Product              | Price    | Category |
|----------------------|----------|----------|
| Fresh Coconut        | ₹35/pc   | fresh    |
| Tender Coconut       | ₹50/pc   | fresh    |
| Coconut Oil 500ml    | ₹280     | oil      |
| Coconut Oil 1L       | ₹520     | oil      |
| Coconut Tinder       | ₹120/kg  | dry      |
| Shell Charcoal       | ₹180/kg  | dry      |

---

## 📍 Delivery Coverage

All 38 Tamil Nadu districts:
Chennai, Coimbatore, Madurai, Tiruchirappalli, Salem, Tirunelveli, Vellore, Erode, Thoothukudi, Dindigul, Thanjavur, Ranipet, Kanchipuram, Nagapattinam, Cuddalore, and 23 more!

---

## 🔮 Future Integrations

- **Payment**: Replace dummy form with Razorpay/Stripe
- **SMS**: Twilio for OTP verification and order updates  
- **Email**: Nodemailer for order confirmations
- **Tracking**: Integrate Delhivery/India Post API

---

## 📞 Admin Contacts for Couriers

After order is placed, admin should use:
- **India Post**: indiapost.gov.in
- **DTDC**: dtdc.com  
- **Delhivery**: delhivery.com
- **BlueDart**: bluedart.com
