import { useState } from "react";

const C = {
  pink:"#D4888C",pinkL:"#F5D5D5",pinkBg:"#FDF0F0",
  sage:"#7CA98A",sageL:"#C8DFD0",sageBg:"#F0F7F2",
  blue:"#7AACC9",blueL:"#C5DDF0",blueBg:"#EFF6FC",
  lav:"#9E8FCC",lavL:"#D8D0F0",lavBg:"#F4F1FB",
  peach:"#C9956A",peachL:"#EDD9BE",peachBg:"#FBF4EB",
  teal:"#6AAFAF",tealL:"#BEDDDD",tealBg:"#EDF6F6",
  mauve:"#B07898",mauveL:"#E0C4D8",mauveBg:"#F8F0F5",
  mustard:"#C4A547",mustardL:"#EAD9A0",mustardBg:"#FAF5E4",
  warm:"#3D2E1E",mid:"#6B5744",soft:"#9E8E7E",
  bg:"#FDFAF7",white:"#FFFFFF",
};

const KEY = (page, section, i) => `${page}__${section}__${i}`;

function useChecks() {
  const [checks, setChecks] = useState(() => {
    try { return JSON.parse(localStorage.getItem("adhd_checks") || "{}"); }
    catch { return {}; }
  });
  const toggle = (k) => setChecks(prev => {
    const next = { ...prev, [k]: !prev[k] };
    try { localStorage.setItem("adhd_checks", JSON.stringify(next)); } catch {}
    return next;
  });
  return { checks, toggle };
}

function CheckItem({ label, color, accent, done, onToggle, badge }) {
  return (
    <div onClick={onToggle} style={{
      display:"flex", alignItems:"center", gap:10,
      padding:"7px 10px", borderRadius:7, cursor:"pointer",
      background: done ? "rgba(0,0,0,0.03)" : C.white,
      border: `1px solid ${done ? "rgba(0,0,0,0.06)" : color + "44"}`,
      transition:"all 0.15s", opacity: done ? 0.6 : 1, marginBottom:3,
    }}>
      <div style={{
        width:18, height:18, borderRadius:4, flexShrink:0,
        border: `2.5px solid ${accent || color}`,
        background: done ? (accent || color) : "transparent",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:11, color:"#fff", transition:"all 0.15s",
      }}>{done ? "✓" : ""}</div>
      <span style={{
        flex:1, fontSize:13, fontWeight:500, lineHeight:1.3,
        textDecoration: done ? "line-through" : "none",
        color: done ? C.soft : C.warm,
      }}>{label}</span>
      {badge && <span style={{
        fontSize:10, fontWeight:800, padding:"2px 7px", borderRadius:10,
        background: color + "33", color: accent || C.warm, whiteSpace:"nowrap",
      }}>{badge}</span>}
    </div>
  );
}

function SectionBlock({ title, icon, color, accent, items, page, sectionId, checks, toggle }) {
  const done = items.filter((_, i) => checks[KEY(page, sectionId, i)]).length;
  const pct = items.length ? Math.round(done / items.length * 100) : 0;
  return (
    <div style={{ marginBottom:16 }}>
      <div style={{
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background: color, borderRadius:"8px 8px 0 0", padding:"8px 14px",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:7 }}>
          <span style={{ fontSize:15 }}>{icon}</span>
          <span style={{ fontFamily:"'Dancing Script', cursive", fontSize:18, fontWeight:700, color:C.white }}>{title}</span>
        </div>
        <span style={{ fontSize:10, fontWeight:800, color:C.white, opacity:0.85, background:"rgba(255,255,255,0.2)", padding:"2px 8px", borderRadius:10 }}>
          {done}/{items.length} ✓
        </span>
      </div>
      <div style={{ height:4, background: color + "44" }}>
        <div style={{ height:"100%", width:`${pct}%`, background: accent || color, borderRadius:"0 2px 2px 0", transition:"width 0.4s ease" }} />
      </div>
      <div style={{ background: color + "18", border:`1px solid ${color}44`, borderTop:"none", borderRadius:"0 0 8px 8px", padding:"10px 10px 8px" }}>
        {items.map((item, i) => (
          <CheckItem key={i} label={item.label || item} badge={item.badge}
            color={color} accent={accent}
            done={!!checks[KEY(page, sectionId, i)]}
            onToggle={() => toggle(KEY(page, sectionId, i))} />
        ))}
      </div>
    </div>
  );
}

function Progress({ items, page, checks, color }) {
  const keys = items.flatMap(s => s.items.map((_, i) => KEY(page, s.id, i)));
  const done = keys.filter(k => checks[k]).length;
  const pct = keys.length ? Math.round(done / keys.length * 100) : 0;
  return (
    <div style={{ marginBottom:16, background: color + "22", borderRadius:10, padding:"12px 16px", border:`1px solid ${color}44` }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:6 }}>
        <span style={{ fontSize:12, fontWeight:800, color:C.mid, letterSpacing:0.5 }}>PROGRESS</span>
        <span style={{ fontSize:12, fontWeight:800, color }}>{done}/{keys.length} — {pct}%</span>
      </div>
      <div style={{ height:10, background:"rgba(0,0,0,0.08)", borderRadius:6 }}>
        <div style={{ height:"100%", width:`${pct}%`, borderRadius:6, background:`linear-gradient(90deg,${color},${color}cc)`, transition:"width 0.5s ease" }} />
      </div>
      {pct === 100 && <div style={{ textAlign:"center", marginTop:8, fontSize:18 }}>🎉 Amazing — all done!</div>}
    </div>
  );
}

function ATip({ text, bg, accent }) {
  return (
    <div style={{ background:bg, border:`1.5px solid ${accent}55`, borderRadius:10, padding:"10px 14px", marginBottom:16, display:"flex", alignItems:"flex-start", gap:10 }}>
      <span style={{ fontSize:18, flexShrink:0 }}>💡</span>
      <p style={{ fontSize:12.5, fontWeight:600, color:C.mid, lineHeight:1.5, margin:0 }}>{text}</p>
    </div>
  );
}

// ── DATA ──────────────────────────────────────────────────

const DAILY_DATA = [
  { id:"morning", title:"Morning Routine", icon:"☀️", color:C.pink, accent:C.mauve, items:[
    "Make the Bed","Quickly clean the bathroom","Scrub the Toilet",
    "Empty Dish Rack","Fold Blankets & Arrange Furniture",
    "Do one load of laundry","Wipe down kitchen countertops",
    "Sweep / Vacuum the floors","Empty the trash cans","Feed Pet",
  ]},
  { id:"breakfast", title:"After Breakfast", icon:"🍳", color:C.peach, accent:C.mustard, items:[
    "Wash Dishes","Load dishes into dishwasher","Clean kitchen countertops",
    "Clean Stovetop","Wash and rinse the sink","Sweep the kitchen floor",
    "Wipe down appliances (toaster, microwave, coffee maker)",
    "Wipe down dining table","Mop Floor","Wipe appliances",
  ]},
  { id:"midday", title:"Midday Routine", icon:"🕐", color:C.blue, accent:C.teal, items:[
    "Wipe down surfaces in living room","Vacuum / Sweep Living room & Entryway",
    "Put away Books & toys","Dust Chairs, tables, bed etc",
    "Return items to their proper places","Put away towels and toiletries",
    "Transfer clothes from washing machine to dryer","Fold clean Laundry",
    "Dust surfaces: shelves, picture frames & electronics",
    "Water plants if needed","Clean up any pet hair in common areas",
  ]},
  { id:"night", title:"Night / Before Bed", icon:"🌙", color:C.lav, accent:C.mauve, items:[
    "Wash dishes and load the dishwasher","Wipe down countertops and stove",
    "Fluff and arrange pillows and cushions in living room",
    "Quickly wipe bathroom sink, counter & faucet",
    "Hang up or fold used towels","Empty the bathroom trash can if needed",
    "Make your bed or straighten the covers","Put away any clothes or items left out",
    "Dust surfaces like nightstands or dressers",
    "Fold and put away any clean laundry","Shake out or clean doormats if needed",
    "Organize shoes and coats in the entryway",
    "Organize charging cables and devices","Feed and water pets, clean their dishes",
  ]},
];

const WEEKLY_DATA = [
  { id:"monday", title:"Monday — Kitchen", icon:"🍽️", color:C.pink, accent:C.mauve, items:[
    "Clean sink","Clean Stovetop","Clean Kitchen Table","Wipe Appliances",
    "Wipe Fridge","Sweep & Mop the floors","Clean and Dry Dish Rack","Sanitize Surfaces",
  ]},
  { id:"tuesday", title:"Tuesday — Living Area", icon:"🛋️", color:C.peach, accent:C.mustard, items:[
    "Vacuum & Mop Floor","Clean Electronics","Dust & Wipe Furniture","Declutter",
    "Spot Clean Stains","Arrange Furniture","Organize Books / magazines","Check lighting",
  ]},
  { id:"wednesday", title:"Wednesday — Bedrooms", icon:"🛏️", color:C.sage, accent:C.teal, items:[
    "Vacuum & Mop Floor","Change sheets","Dust & Wipe Furniture","Declutter",
    "Tidy clothes & drawer","Spot Clean Stains","Air Purification","Organize Clothing",
  ]},
  { id:"thursday", title:"Thursday — Bathrooms", icon:"🚿", color:C.blue, accent:C.teal, items:[
    "Wipe Mirrors","Clean toilet, bath & sink","Vacuum & Mop Floor",
    "Stock up Toilet paper","Replace towels & Rugs","Empty Trash","Clean Mirrors","Check for Spills",
  ]},
  { id:"friday", title:"Friday — Entrance", icon:"🚪", color:C.lav, accent:C.mauve, items:[
    "Change Rugs","Organize shoes / coats","Disinfect Doorknobs","Dust Surfaces",
    "Dust and Wipe Decorations","Clean Glass Surfaces","Shake Out Welcome Mats","Check for Spills",
  ]},
  { id:"saturday", title:"Saturday — Grocery & Fridge", icon:"🛒", color:C.mustard, accent:C.peach, items:[
    "Clean out Fridge","Organize Pantry","Clear out Expired Items","Check Ingredient Stocks",
    "Plan Your Meals","Make a Shopping List","Do Grocery shopping","Unload and Organize",
  ]},
  { id:"sunday", title:"Sunday — Misc / Rest", icon:"🌿", color:C.teal, accent:C.sage, items:[
    "Vacuum Car","Clean Blinds","Clean Hallways","Remove Pet Hair",
    "Clean Under Furniture","Declutter Drawers","Clean Dryer Vent","Clean Carpet & Rug",
  ]},
];

const MONTHLY_DATA = [
  { id:"kitchen_m", title:"Kitchen Deep Clean", icon:"🍳", color:C.pink, accent:C.mauve, items:[
    "Wipe Kitchen Cabinets inside & out","Clean Microwave — Inside & Outside",
    "Clean Oven — Inside & Outside","Clean Toaster","Deep Clean Fridge & Freezer",
    "Disinfect Trash cans","Clean Dishwasher filter",
    "Wipe small appliances (blender, coffee maker)",
    "Scrub sink and faucets with baking soda",
    "Empty & clean all shelves and drawers","Clean and replace shelf liners if needed",
  ]},
  { id:"bathroom_m", title:"Bathroom Deep Clean", icon:"🚿", color:C.blue, accent:C.teal, items:[
    "Scrub tiles and grout","Clean & Disinfect toilet bowl",
    "Wipe toilet bowl & surrounding surface","Clean Mirrors","Dust light fixtures",
    "Empty & disinfect trash can","Sweep & Mop floor","Spot clean floor stains",
    "Wash bath mats","Restock toiletries","Clean shower curtain / doors",
    "Wipe down cabinet doors and shelves",
  ]},
  { id:"bedroom_m", title:"Bedroom Deep Clean", icon:"🛏️", color:C.lav, accent:C.mauve, items:[
    "Wash Duvets & Blankets","Vacuum & rotate mattresses","Clean Laundry room",
    "Organize Drawers","Clean below Furniture","Dust ceiling fans & light fixtures",
    "Wipe down baseboards","Organize wardrobe / closet","Spot clean walls","Clean windows inside",
  ]},
  { id:"living_m", title:"Living Room Deep Clean", icon:"🛋️", color:C.sage, accent:C.teal, items:[
    "Deep clean carpets or rugs","Vacuum upholstered furniture",
    "Wipe down electronics","Clean & organise bookshelf",
    "Treat leather sofas and chairs","Dust all surfaces & ornaments",
    "Clean glass surfaces & picture frames","Shake out & wash cushion covers",
    "Wipe down skirting boards","Clean windows inside",
  ]},
  { id:"general_m", title:"Whole Home Monthly", icon:"🏠", color:C.peach, accent:C.mustard, items:[
    "Replace air filters","Dust light fixtures & ceiling fans",
    "Clean windows and blinds","Disinfect high-touch surfaces",
    "Organise garage or store areas","Sweep, Clean & Mop all floors",
    "Remove cobwebs from high corners","Wipe down all doors and handles",
    "Check and replace burnt-out bulbs","Clean entryway mats & shoe rack",
  ]},
];

const SPEED_DATA = [
  { id:"sp_supplies", title:"Grab Supplies First!", icon:"🧺", color:C.mauve, accent:C.pink, items:[
    "All-purpose / multi-surface cleaner","Disinfectant spray or wipes","Glass cleaner",
    "Microfibre cleaning cloths or paper towels","Broom, vacuum cleaner & dustpan",
    "Mop & bucket / scrubbing sponge","Trash bags, toilet-bowl cleaner and brush",
  ]},
  { id:"sp_kitchen", title:"Kitchen — 5–10 mins", icon:"🍽️", color:C.pink, accent:C.mauve, items:[
    {label:"Pick up & put away items that don't belong", badge:"2 min"},
    {label:"Put dirty dishes in sink", badge:"1 min"},
    {label:"Manually wash dishes as needed", badge:"5 min"},
    {label:"Disinfect and wipe all counters", badge:"2 min"},
    {label:"Wipe exteriors of all appliances", badge:"2 min"},
    {label:"Wipe down stove tops", badge:"2 min"},
    {label:"Spot clean all walls", badge:"1 min"},
    {label:"Take out trash & recycling", badge:"1 min"},
    {label:"Clear dining room table", badge:"1 min"},
  ]},
  { id:"sp_bedroom", title:"Bedrooms — 5 mins", icon:"🛏️", color:C.sage, accent:C.teal, items:[
    {label:"Pick up & put away items", badge:"2 min"},
    {label:"Make the Bed", badge:"3 min"},
    {label:"Dust all surfaces", badge:"2 min"},
    {label:"Vacuum floor", badge:"3 min"},
    {label:"Put away clean clothes", badge:"2 min"},
    {label:"Clear clutter from dresser / nightstand", badge:"1 min"},
  ]},
  { id:"sp_living", title:"Living Room — 5–10 mins", icon:"🛋️", color:C.blue, accent:C.teal, items:[
    {label:"Pick up & put away items / trash", badge:"2 min"},
    {label:"Dust all surfaces", badge:"2 min"},
    {label:"Clean & organise desk area", badge:"2 min"},
    {label:"Wipe down furniture, table & chair", badge:"2 min"},
    {label:"Wipe down electronics", badge:"1 min"},
    {label:"Shake out rugs", badge:"1 min"},
    {label:"Vacuum floor", badge:"3 min"},
  ]},
  { id:"sp_bathroom", title:"Bathroom — 5 mins", icon:"🚿", color:C.peach, accent:C.mustard, items:[
    {label:"Clean & disinfect toilet bowl", badge:"2 min"},
    {label:"Wipe toilet bowl & surrounding surface", badge:"1 min"},
    {label:"Clean mirrors", badge:"1 min"},
    {label:"Dust", badge:"1 min"},
    {label:"Empty trash can", badge:"1 min"},
    {label:"Sweep floor", badge:"1 min"},
    {label:"Spot clean floor stains", badge:"1 min"},
  ]},
  { id:"sp_everywhere", title:"Everywhere — 5–10 mins", icon:"✨", color:C.lav, accent:C.mauve, items:[
    {label:"Vacuum carpet, rugs & other areas", badge:"5 min"},
    {label:"Quickly mop floors", badge:"5 min"},
    {label:"Clean mirror & glass surfaces", badge:"2 min"},
    {label:"Quickly empty all trash bins", badge:"2 min"},
    {label:"Wipe all tables & furniture", badge:"3 min"},
  ]},
];

const YEARLY_DATA = [
  { id:"jan", title:"January", icon:"❄️", color:C.pink, accent:C.mauve, items:["Deep clean kitchen appliances","Declutter and organize closets","Clean windows and blinds","Dust light fixtures & ceiling fans","Replace air filters","Vacuum upholstery and rugs"] },
  { id:"feb", title:"February", icon:"💝", color:C.lav, accent:C.mauve, items:["Scrub bathroom tiles & fixtures","Launder bedding and linens","Dust and polish furniture","Clean baseboards and trim","Organize garage or store areas","Sweep, Clean & Mop Floors"] },
  { id:"mar", title:"March", icon:"🌱", color:C.sage, accent:C.teal, items:["Dust curtains & clean air vents","Wipe down electronics","Sweep outdoor areas & trim bushes","Deep clean carpets or rugs","Declutter and organize pantry","Sweep, Clean & Mop Floors"] },
  { id:"apr", title:"April", icon:"🌸", color:C.peach, accent:C.mustard, items:["Wash windows inside & out","Clean kitchen cabinets & appliances","Check plumbing for leaks","Dust and polish woodwork","Clean outdoor furniture","Sweep, Clean & Mop Floors"] },
  { id:"may", title:"May", icon:"🌻", color:C.mustard, accent:C.peach, items:["Organize and clean closets","Dust and polish wood furniture","Clean ceiling fans & light fixtures","Deep clean oven & range hood","Sweep, Clean & Mop Floors"] },
  { id:"jun", title:"June", icon:"☀️", color:C.teal, accent:C.sage, items:["Sweep, Clean & Mop Floors","Scrub grill and outdoor equipment","Deep clean refrigerator","Spot clean walls & touch-up paint","Vacuum upholstered furniture"] },
  { id:"jul", title:"July", icon:"🏖️", color:C.blue, accent:C.teal, items:["Declutter tools & storage items","Vacuum and rotate mattresses","Scrub and seal tile grout","Scrub grill grates & replace propane","Clean outside windows & screens","Sweep and apply deck treatment"] },
  { id:"aug", title:"August", icon:"🌿", color:C.sage, accent:C.teal, items:["Scrub showers, toilets & sinks","Organize & dust books / shelves","Treat leather sofas and chairs","Remove dust and debris from vents","Organize files & shred documents","Wipe down frequently touched surfaces"] },
  { id:"sep", title:"September", icon:"🍂", color:C.peach, accent:C.mustard, items:["Clean fireplace and chimney","Dust and clean blinds","Clean washing machine","Remove cobwebs from high corners","Arrange tools for easy access","Sweep porch and clean door & doormat"] },
  { id:"oct", title:"October", icon:"🎃", color:C.mustard, accent:C.peach, items:["Clean & organise kitchen pantry","Dust and clean electronics","Shine refrigerator & dishwasher","Clean light fixtures"] },
  { id:"nov", title:"November", icon:"🍁", color:C.mauve, accent:C.pink, items:["Clean gutters and downspouts","Dust and clean ceiling fans","Deep clean oven","Vacuum, clean rugs and carpets"] },
  { id:"dec", title:"December", icon:"⛄", color:C.lav, accent:C.mauve, items:["Holiday cleaning","Wipe down holiday lights","Prepare fireplace for holiday use","Clean & refresh entryway mats"] },
];

const LAUNDRY_DAYS = [
  { day:"Mon", label:"TOWELS & LINENS", color:C.pink, accent:C.mauve, items:["Bath towels","Hand towels","Washcloths","Bed linens (sheets, pillowcases)"] },
  { day:"Tue", label:"WHITE CLOTHES", color:C.peach, accent:C.mustard, items:["White shirts, t-shirts","White linens (if needed)","White socks, underwear"] },
  { day:"Wed", label:"DARK CLOTHES", color:C.mustard, accent:C.peach, items:["Dark jeans","Black or dark-coloured T-shirts","Dark-coloured dress / skirts","Dark underwear","All dark coloured clothes"] },
  { day:"Thu", label:"DELICATES", color:C.blue, accent:C.teal, items:["Delicate clothing (lingerie, silk, lace)","Anything with hand-wash label"] },
  { day:"Fri", label:"WORKOUT CLOTHES", color:C.sage, accent:C.teal, items:["Activewear","Sports bras","Gym clothes"] },
  { day:"Sat", label:"BEDDING", color:C.lav, accent:C.mauve, items:["Bed sheets","Pillowcases","Duvet covers","Bed linens"] },
  { day:"Sun", label:"REST DAY", color:C.teal, accent:C.sage, items:["Rest from laundry or catch up on any missed tasks during the week"] },
];

const LAUNDRY_TIPS = [
  "Sort laundry by colour (lights, darks, whites) to prevent colour bleeding.",
  "Pre-treat stains with a stain remover before washing.",
  "Use cold water for dark and coloured clothes to preserve vibrancy.",
  "Wash towels separately to prevent lint transfer onto clothing.",
  "Empty pockets and fasten zippers before washing to avoid damage.",
  "Clean the washing machine regularly to prevent mildew and odours.",
  "Wash & dry clothes in the morning. Fold clothes in the afternoon.",
  "Have a laundry basket for each family member.",
];

// ── PAGES ────────────────────────────────────────────────

function DailyPage({ checks, toggle }) {
  return (
    <div>
      <Progress items={DAILY_DATA} page="daily" checks={checks} color={C.pink} />
      <ATip text="Start with ONE task. Tick it off. Then pick the next. You've got this! ☀️" bg={C.pinkBg} accent={C.pink} />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {DAILY_DATA.map(s => <SectionBlock key={s.id} {...s} page="daily" sectionId={s.id} checks={checks} toggle={toggle} />)}
      </div>
    </div>
  );
}

function WeeklyPage({ checks, toggle }) {
  return (
    <div>
      <ATip text="One room per day = no overwhelm. Focus ONLY on today's section. You don't have to do it all! 📅" bg={C.peachBg} accent={C.peach} />
      {WEEKLY_DATA.map(s => <SectionBlock key={s.id} {...s} page="weekly" sectionId={s.id} checks={checks} toggle={toggle} />)}
    </div>
  );
}

function MonthlyPage({ checks, toggle }) {
  return (
    <div>
      <ATip text="Pick ONE deep-clean zone per week. Spread it out — no guilt, no rush! 🏠" bg={C.sageBg} accent={C.sage} />
      {MONTHLY_DATA.map(s => <SectionBlock key={s.id} {...s} page="monthly" sectionId={s.id} checks={checks} toggle={toggle} />)}
    </div>
  );
}

function SpeedPage({ checks, toggle }) {
  return (
    <div>
      <ATip text="Set a 10-minute timer. Grab your supplies. GO! Speed cleaning resets your space fast. ⚡" bg={C.lavBg} accent={C.lav} />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:14 }}>
        {SPEED_DATA.map(s => (
          <div key={s.id} style={s.id === "sp_supplies" ? { gridColumn:"1/-1" } : {}}>
            <SectionBlock {...s} page="speed" sectionId={s.id} checks={checks} toggle={toggle} />
          </div>
        ))}
      </div>
    </div>
  );
}

function YearlyPage({ checks, toggle }) {
  const months = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"];
  const curId = months[new Date().getMonth()];
  return (
    <div>
      <ATip text="Focus on this month's box only. Tick & feel proud — one month at a time! 🗓️" bg={C.mustardBg} accent={C.mustard} />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
        {YEARLY_DATA.map(s => (
          <div key={s.id} style={s.id === curId ? { gridColumn:"1/-1" } : {}}>
            {s.id === curId && <div style={{ fontSize:11, fontWeight:800, color:C.mustard, letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>📍 THIS MONTH</div>}
            <SectionBlock {...s} page="yearly" sectionId={s.id} checks={checks} toggle={toggle} />
          </div>
        ))}
      </div>
    </div>
  );
}

function LaundryPage({ checks, toggle }) {
  return (
    <div>
      <ATip text="One load per day = never a laundry mountain again! Just start with today's pile. 🧺" bg={C.sageBg} accent={C.sage} />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
        {LAUNDRY_DAYS.map(d => (
          <div key={d.day} style={{ display:"flex" }}>
            <div style={{ background:d.color, borderRadius:"8px 0 0 8px", minWidth:56, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"8px 6px" }}>
              <span style={{ fontFamily:"'Dancing Script', cursive", fontSize:22, color:C.white, fontWeight:700, lineHeight:1 }}>{d.day}</span>
              <span style={{ fontSize:8, fontWeight:800, color:C.white + "CC", textAlign:"center", letterSpacing:0.5, marginTop:2, lineHeight:1.2 }}>{d.label}</span>
            </div>
            <div style={{ flex:1, background:d.color + "18", border:`1px solid ${d.color}44`, borderRadius:"0 8px 8px 0", borderLeft:"none", padding:"8px 10px" }}>
              {d.items.map((item, i) => (
                <CheckItem key={i} label={item} color={d.color} accent={d.accent}
                  done={!!checks[KEY("laundry", d.day, i)]}
                  onToggle={() => toggle(KEY("laundry", d.day, i))} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <div style={{ background:C.sageBg, border:`1px solid ${C.sage}44`, borderRadius:10, padding:"12px 14px" }}>
        <div style={{ fontSize:11, fontWeight:800, letterSpacing:1, color:C.sage, marginBottom:8, textTransform:"uppercase" }}>🧺 Laundry Tips</div>
        {LAUNDRY_TIPS.map((t, i) => (
          <div key={i} style={{ display:"flex", gap:7, marginBottom:4 }}>
            <span style={{ color:C.sage, fontWeight:800, flexShrink:0, fontSize:12 }}>•</span>
            <span style={{ fontSize:12, color:C.mid, lineHeight:1.4 }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── APP ──────────────────────────────────────────────────

const TABS = [
  { id:"daily",   label:"☀️ Daily",   color:C.pink,    text:C.mauve   },
  { id:"weekly",  label:"📅 Weekly",  color:C.peach,   text:C.peach   },
  { id:"monthly", label:"🏠 Monthly", color:C.sage,    text:C.sage    },
  { id:"speed",   label:"⚡ Speed",   color:C.lav,     text:C.lav     },
  { id:"laundry", label:"🧺 Laundry", color:C.teal,    text:C.teal    },
  { id:"yearly",  label:"🗓️ Yearly",  color:C.mustard, text:C.mustard },
];

export default function App() {
  const [tab, setTab] = useState("daily");
  const { checks, toggle } = useChecks();
  const active = TABS.find(t => t.id === tab);

  return (
    <div style={{ background:C.bg, minHeight:"100vh", fontFamily:"'Nunito', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Nunito:wght@400;500;600;700;800&family=Dancing+Script:wght@600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-thumb { background: #D4C8BE; border-radius: 3px; }
        @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      `}</style>

      <div style={{ maxWidth:960, margin:"0 auto", padding:"16px 12px 40px" }}>

        {/* HEADER */}
        <div style={{ textAlign:"center", padding:"20px 0 14px" }}>
          <div style={{ fontSize:11, letterSpacing:2, fontWeight:800, color:C.soft, textTransform:"uppercase", marginBottom:4 }}>✦ ADHD-Friendly ✦</div>
          <div style={{ fontFamily:"'Dancing Script', cursive", fontSize:22, color:active.text, marginBottom:2 }}>Your Home, Your Calm</div>
          <div style={{ fontFamily:"'Playfair Display', serif", fontSize:34, fontWeight:800, color:C.warm, letterSpacing:"-0.5px", lineHeight:1.1 }}>
            Cleaning Planner
          </div>
          <div style={{ fontSize:12, color:C.soft, marginTop:6, fontWeight:600 }}>
            Bite-sized tasks · Color-coded · Built for minds like mine 🧠
          </div>
        </div>

        {/* COLOUR LEGEND */}
        <div style={{ display:"flex", gap:8, flexWrap:"wrap", justifyContent:"center", marginBottom:12 }}>
          {[
            { c:C.pink,    l:"Morning/Kitchen" },
            { c:C.peach,   l:"Breakfast/Mon"   },
            { c:C.sage,    l:"Bedroom/Wed"      },
            { c:C.blue,    l:"Midday/Bathroom"  },
            { c:C.lav,     l:"Night/Fri"        },
            { c:C.mustard, l:"Sat/Yearly"       },
            { c:C.teal,    l:"Sun/Laundry"      },
          ].map(({ c, l }) => (
            <div key={l} style={{ display:"flex", alignItems:"center", gap:5 }}>
              <div style={{ width:12, height:12, borderRadius:3, background:c }} />
              <span style={{ fontSize:10, fontWeight:700, color:C.soft }}>{l}</span>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div style={{ display:"flex", gap:6, flexWrap:"wrap", justifyContent:"center", margin:"0 0 20px", padding:"12px", background:C.white, borderRadius:14, boxShadow:"0 2px 12px rgba(0,0,0,0.07)" }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding:"8px 18px", borderRadius:20,
              border: tab === t.id ? `2.5px solid ${t.text}` : "2.5px solid transparent",
              background: tab === t.id ? t.color + "28" : "rgba(0,0,0,0.04)",
              color: tab === t.id ? t.text : C.mid,
              fontFamily:"'Nunito', sans-serif", fontSize:13, fontWeight:700,
              cursor:"pointer", transition:"all 0.2s",
              boxShadow: tab === t.id ? `0 2px 8px ${t.color}44` : "none",
              transform: tab === t.id ? "translateY(-1px)" : "none",
            }}>{t.label}</button>
          ))}
        </div>

        {/* PAGE CONTENT */}
        <div key={tab} style={{ animation:"fadeIn 0.25s ease" }}>
          {tab === "daily"   && <DailyPage   checks={checks} toggle={toggle} />}
          {tab === "weekly"  && <WeeklyPage  checks={checks} toggle={toggle} />}
          {tab === "monthly" && <MonthlyPage checks={checks} toggle={toggle} />}
          {tab === "speed"   && <SpeedPage   checks={checks} toggle={toggle} />}
          {tab === "laundry" && <LaundryPage checks={checks} toggle={toggle} />}
          {tab === "yearly"  && <YearlyPage  checks={checks} toggle={toggle} />}
        </div>

        <div style={{ textAlign:"center", marginTop:32, fontSize:11, color:C.soft, fontWeight:600 }}>
          ✨ Progress saved automatically · Tap any task to check it off · You're doing amazing ✨
        </div>
      </div>
    </div>
  );
}
