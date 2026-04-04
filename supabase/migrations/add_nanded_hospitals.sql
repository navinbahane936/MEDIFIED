-- Insert Nanded Hospitals
-- These hospitals will be added to the database with specified locations and names

-- First, store the hospital IDs we'll use for the bed tracking
WITH new_hospitals AS (
  INSERT INTO hospitals (name, location, address, latitude, longitude, distance_km, phone, is_online)
  VALUES
    ('Yashosai Hospital', 'Near Kautha', 'Near Kautha, Nanded, Maharashtra', 19.1383, 77.3200, 0.0, '+91-2462-231111', true),
    ('Icon Hospital', 'Doctor Lane 2', 'Doctor Lane 2, Nanded, Maharashtra', 19.1450, 77.3250, 1.2, '+91-2462-232222', true),
    ('Aadhar Hospital', 'Shivaji Nager', 'Shivaji Nager, Nanded, Maharashtra', 19.1500, 77.3300, 2.5, '+91-2462-233333', true),
    ('Rukhmai Hospital', 'VIP Road', 'VIP Road, Nanded, Maharashtra', 19.1550, 77.3350, 3.0, '+91-2462-234444', true),
    ('Global Hospital', 'Nanded City Center', 'Central Business District, Nanded, Maharashtra', 19.1600, 77.3400, 3.5, '+91-2462-235555', true)
  RETURNING id, name
)
-- Insert bed availability for each hospital
INSERT INTO bed_availability (hospital_id, bed_type, total_beds, available_beds, status)
SELECT 
  nh.id,
  bed_type,
  total_beds,
  available_beds,
  CASE 
    WHEN (available_beds::float / total_beds) > 0.4 THEN 'AVAILABLE'
    WHEN (available_beds::float / total_beds) > 0.2 THEN 'MODERATE'
    ELSE 'CRITICAL'
  END as status
FROM new_hospitals nh
CROSS JOIN (
  VALUES
    ('ICU', 10, 6),
    ('Oxygen', 20, 14),
    ('Ventilator', 8, 3),
    ('Cardiac', 12, 9),
    ('Oncology', 6, 4),
    ('General', 50, 35)
) AS bed_types(bed_type, total_beds, available_beds);
