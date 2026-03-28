# Analytics Scripts

## Available Scripts

### 1. Migrate Product Stats
**Command:** `npm run migrate:stats`

**Purpose:** Migrates existing lifetime counter data from the `products` table into the `product_events` table for historical analytics.

**When to use:**
- After initial setup to preserve historical data
- One-time migration to sync old stats

**What it does:**
- Reads viewsCount, addToCartCount, purchaseCount, cancelCount from products
- Creates corresponding ProductEvent records
- Uses product creation date as timestamp for historical events

---

### 2. Boost Conversion Rates
**Command:** `npm run boost:data`

**Purpose:** Generates realistic orders to achieve target conversion rates (40-60%) for analytics demonstration.

**Target Conversion Rates:**
- **Top 3 Products:** 55% conversion rate
- **Mid-Tier Products (4-8):** 40% conversion rate  
- **Other Products:** 25% conversion rate

**What it does:**
1. Analyzes current view counts and sales for all products
2. Calculates how many orders needed to hit target conversion rates
3. Creates Order and OrderItem records with:
   - Status: PAID or DELIVERED (counted as conversions)
   - Timestamps: Distributed across last 7 days for natural-looking data
   - Quantities: 1-2 items per order for realism
   - Test User: Uses/creates `test-analytics@follicia.com`

**Safety:**
- ✅ Only adds new Order/OrderItem records
- ✅ Does NOT modify existing Product data
- ✅ Does NOT touch ProductEvent view/click data
- ✅ Analytics API naturally picks up the new orders

**Example Output:**
```
📋 Conversion Boost Plan:

Product                             Tier   Views    Current    Target     Orders Needed
────────────────────────────────────────────────────────────────────────────────────────
Scalp Detox Shampoo                 TOP    150      12.00%     55%        71
Hair Growth Serum                   TOP    120      8.33%      55%        56
Deep Repair Mask                    TOP    100      15.00%     55%        40
...

📦 Total orders to create: 245
```

**After Running:**
- Refresh your Analytics Dashboard
- Filter by "Last 7 Days" or "Today" to see boosted conversion rates
- Conversion percentages will show in seafoam green (> 0%)

---

## Workflow

### Initial Setup (One Time)
```bash
# 1. Migrate historical stats
npm run migrate:stats

# 2. Boost conversion rates for demo
npm run boost:data
```

### Regular Use
- The tracking system automatically creates ProductEvent records for views/carts
- Orders created through the app automatically count as conversions
- Run `npm run boost:data` again if you need to re-calibrate after adding new products

---

## Technical Details

### Database Tables Used

**ProductEvent** (for views/carts):
- `type`: 'VIEW', 'CART'
- `productId`: Reference to product
- `createdAt`: Timestamp of event

**Order** (for conversions):
- `status`: 'PAID', 'SHIPPED', 'DELIVERED' (counted as conversions)
- `status`: 'CANCELLED' (counted as cancellations)
- `createdAt`: Order timestamp

**OrderItem** (for product-level sales):
- `productId`: Which product was sold
- `quantity`: How many units
- `price`: Price at time of sale

### Conversion Rate Formula
```
Conversion Rate = (Total Products Sold / Total Views) × 100
```

Where:
- **Total Views** = COUNT of ProductEvent records with type='VIEW'
- **Total Products Sold** = SUM of OrderItem.quantity where Order.status IN ('PAID', 'SHIPPED', 'DELIVERED')

Both filtered by the selected date range (Today, 7 days, 30 days, This Month).
