# Design & Pricing Engine Approach

## Database Modeling
The core challenge was to handle **multi-resource availability**. A traditional "Bookings" table that just links User and Court wouldn't suffice because equipment and coaches are finite shared resources.

I designed a **Booking Schema** that acts as the central atomic record. It embeds the usage of resources:
```javascript
{
  court: CourtID,
  resources: {
     rackets: 2,
     coach: CoachID
  },
  time: [Start, End]
}
```
This allows a single query pattern to check availability:
1. **Courts**: Check for direct time overlaps on the specific `courtId`.
2. **Coaches**: Check for time overlaps where `resources.coach` matches the requested coach.
3. **Equipment**: This uses an aggregative approach. To check if 2 rackets are available, I find *all* active bookings in that time slot, sum their `resources.rackets` count, and check if validity against `Equipment.totalStock`.

This ensures that even if Users A and B book different courts, they can't overbook the shared pool of rackets.

## Dynamic Pricing Engine
Instead of hardcoding prices, I implemented a **Rule-Based Engine**.
- **Base Price**: Attached to the Court (e.g., $20/hr).
- **PricingRules**: Decoupled documents defining logic like `{ name: "Weekend", type: "multiplier", value: 1.5, conditions: { days: [0,6] } }`.

When a price check occurs:
1. The engine calculates the `Duration` and `Base Cost`.
2. It iterates through all active `PricingRules`.
3. If a rule's conditions (Day, Time, CourtType) match the request, the modifier is applied.
4. Finally, fixed costs for Resources (Rackets * Qty * Duration) are added.

This design allows the Admin to add a "Holiday Special" or "Morning Discount" without changing a single line of code, satisfying the requirement for configuration-driven logic.
