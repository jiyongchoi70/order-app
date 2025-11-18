-- 샘플 메뉴 데이터 삽입
INSERT INTO menus (name, description, price, image, stock) VALUES
('아메리카노 (ICE)', '시원한 아이스 아메리카노', 4000, '/coffee-ice.jpg', 10),
('아메리카노 (HOT)', '따뜻한 핫 아메리카노', 4000, '/coffee-hot.jpg', 10),
('카페라떼', '부드러운 카페라떼', 4500, '/coffee-latte.jpg', 10),
('카푸치노', '진한 카푸치노', 4500, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400', 8),
('카라멜 마키아토', '달콤한 카라멜 마키아토', 5000, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400', 8),
('바닐라라떼', '향긋한 바닐라라떼', 5000, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400', 8)
ON CONFLICT DO NOTHING;

-- 샘플 옵션 데이터 삽입
-- 아메리카노 (ICE) 옵션
INSERT INTO options (name, price, menu_id) VALUES
('샷 추가', 500, 1),
('시럽 추가', 300, 1),
('휘핑크림', 500, 1)
ON CONFLICT DO NOTHING;

-- 아메리카노 (HOT) 옵션
INSERT INTO options (name, price, menu_id) VALUES
('샷 추가', 500, 2),
('시럽 추가', 300, 2),
('휘핑크림', 500, 2)
ON CONFLICT DO NOTHING;

-- 카페라떼 옵션
INSERT INTO options (name, price, menu_id) VALUES
('샷 추가', 500, 3),
('시럽 추가', 300, 3),
('휘핑크림', 500, 3),
('저지방 우유', 0, 3)
ON CONFLICT DO NOTHING;

-- 카푸치노 옵션
INSERT INTO options (name, price, menu_id) VALUES
('샷 추가', 500, 4),
('시럽 추가', 300, 4),
('저지방 우유', 0, 4)
ON CONFLICT DO NOTHING;

-- 카라멜 마키아토 옵션
INSERT INTO options (name, price, menu_id) VALUES
('샷 추가', 500, 5),
('카라멜 시럽 추가', 500, 5),
('휘핑크림', 500, 5)
ON CONFLICT DO NOTHING;

-- 바닐라라떼 옵션
INSERT INTO options (name, price, menu_id) VALUES
('샷 추가', 500, 6),
('바닐라 시럽 추가', 500, 6),
('휘핑크림', 500, 6),
('저지방 우유', 0, 6)
ON CONFLICT DO NOTHING;

