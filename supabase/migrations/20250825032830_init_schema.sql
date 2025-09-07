--
-- PostgreSQL database
-- START
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_updated_at_column() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: approval_workflow_steps; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.approval_workflow_steps (
    id integer NOT NULL,
    workflow_id integer NOT NULL,
    step_order integer NOT NULL,
    approver_type character varying(30) NOT NULL,
    approver_id character varying(50),
    is_required boolean DEFAULT true,
    can_delegate boolean DEFAULT false,
    auto_approve_days integer DEFAULT 0,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT approval_workflow_steps_approver_type_check CHECK (((approver_type)::text = ANY ((ARRAY['direct_manager'::character varying, 'department_head'::character varying, 'hr_manager'::character varying, 'ceo'::character varying, 'specific_person'::character varying, 'any_from_role'::character varying])::text[])))
);


ALTER TABLE public.approval_workflow_steps OWNER TO postgres;

--
-- Name: approval_workflow_steps_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.approval_workflow_steps_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.approval_workflow_steps_id_seq OWNER TO postgres;

--
-- Name: approval_workflow_steps_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.approval_workflow_steps_id_seq OWNED BY public.approval_workflow_steps.id;


--
-- Name: approval_workflows; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.approval_workflows (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    department_id integer,
    leave_type_id integer,
    min_days_threshold numeric(3,1) DEFAULT 0,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.approval_workflows OWNER TO postgres;

--
-- Name: approval_workflows_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.approval_workflows_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.approval_workflows_id_seq OWNER TO postgres;

--
-- Name: approval_workflows_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.approval_workflows_id_seq OWNED BY public.approval_workflows.id;


--
-- Name: audit_logs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_logs (
    id integer NOT NULL,
    table_name character varying(50) NOT NULL,
    record_id character varying(50) NOT NULL,
    action character varying(10) NOT NULL,
    old_values jsonb,
    new_values jsonb,
    changed_by character varying(50),
    changed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    ip_address inet,
    user_agent text,
    CONSTRAINT audit_logs_action_check CHECK (((action)::text = ANY ((ARRAY['INSERT'::character varying, 'UPDATE'::character varying, 'DELETE'::character varying])::text[])))
);


ALTER TABLE public.audit_logs OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_logs_id_seq OWNER TO postgres;

--
-- Name: audit_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_logs_id_seq OWNED BY public.audit_logs.id;


--
-- Name: contact_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contact_info (
    id integer NOT NULL,
    employee_id character varying(50) NOT NULL,
    mobile_phone character varying(20),
    permanent_address text,
    temporary_address text,
    personal_email character varying(100),
    company_email character varying(100),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.contact_info OWNER TO postgres;

--
-- Name: contact_info_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contact_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contact_info_id_seq OWNER TO postgres;

--
-- Name: contact_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contact_info_id_seq OWNED BY public.contact_info.id;


--
-- Name: contracts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.contracts (
    id integer NOT NULL,
    employee_id character varying(50) NOT NULL,
    contract_type character varying(20) NOT NULL,
    contract_number character varying(50),
    sequence_number integer,
    start_date date NOT NULL,
    end_date date,
    signing_date date,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT contracts_contract_type_check CHECK (((contract_type)::text = ANY ((ARRAY['probationary'::character varying, 'labor'::character varying, 'indefinite'::character varying])::text[])))
);


ALTER TABLE public.contracts OWNER TO postgres;

--
-- Name: contracts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.contracts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.contracts_id_seq OWNER TO postgres;

--
-- Name: contracts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.contracts_id_seq OWNED BY public.contracts.id;


--
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    code character varying(20) NOT NULL,
    description text,
    head_id character varying(50),
    parent_department_id integer,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.departments_id_seq OWNER TO postgres;

--
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;


--
-- Name: employee_contacts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_contacts (
    id integer NOT NULL,
    employee_id character varying(50) NOT NULL,
    contact_type character varying(20) NOT NULL,
    full_name character varying(100) NOT NULL,
    relationship character varying(50),
    date_of_birth date,
    phone_number character varying(20),
    email character varying(100),
    address text,
    is_emergency_contact boolean DEFAULT false,
    order_number integer,
    notes text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT employee_contacts_contact_type_check CHECK (((contact_type)::text = ANY ((ARRAY['spouse'::character varying, 'child'::character varying, 'emergency_contact'::character varying, 'parent'::character varying, 'sibling'::character varying, 'other_family'::character varying])::text[])))
);


ALTER TABLE public.employee_contacts OWNER TO postgres;

--
-- Name: employee_contacts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_contacts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_contacts_id_seq OWNER TO postgres;

--
-- Name: employee_contacts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_contacts_id_seq OWNED BY public.employee_contacts.id;


--
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    employee_id character varying(50) NOT NULL,
    number integer NOT NULL,
    full_name_english character varying(150) NOT NULL,
    full_name_vietnamese character varying(150) NOT NULL,
    display_name character varying(100),
    employment_status character varying(20) DEFAULT 'Active'::character varying,
    marital_status character varying(20),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT employees_employment_status_check CHECK (((employment_status)::text = ANY ((ARRAY['Active'::character varying, 'Terminated'::character varying, 'Pre-onboarding'::character varying, 'Onboarding'::character varying])::text[]))),
    CONSTRAINT employees_marital_status_check CHECK (((marital_status)::text = ANY ((ARRAY['Single'::character varying, 'Married'::character varying, 'Divorced'::character varying, 'Widowed'::character varying])::text[])))
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- Name: TABLE employees; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.employees IS 'Main employee information table';


--
-- Name: employment_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employment_info (
    id integer NOT NULL,
    employee_id character varying(50) NOT NULL,
    department_id integer,
    manager_id character varying(50),
    position_vietnamese character varying(100),
    position_english character varying(100),
    grade character varying(20),
    onboarding_date date,
    official_resignation_date date,
    last_working_date date,
    status_of_contract character varying(20),
    status_of_compulsory_insurance character varying(100),
    working_type character varying(20),
    trade_union_registration boolean DEFAULT false,
    employee_status character varying(30) DEFAULT 'Normal'::character varying,
    status_from_date date,
    status_to_date date,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT employment_info_employee_status_check CHECK (((employee_status)::text = ANY ((ARRAY['Normal'::character varying, 'Maternity leave'::character varying, 'Unpaid leave'::character varying, 'Long-term sick leave'::character varying])::text[]))),
    CONSTRAINT employment_info_status_of_contract_check CHECK (((status_of_contract)::text = ANY ((ARRAY['Official'::character varying, 'Internship'::character varying, 'Probation'::character varying, 'Temporary'::character varying])::text[]))),
    CONSTRAINT employment_info_working_type_check CHECK (((working_type)::text = ANY ((ARRAY['Full-time'::character varying, 'Part-time'::character varying, 'Remote'::character varying])::text[])))
);


ALTER TABLE public.employment_info OWNER TO postgres;

--
-- Name: employee_hierarchy; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.employee_hierarchy AS
 WITH RECURSIVE hierarchy AS (
         SELECT e.employee_id,
            e.full_name_english,
            ei.manager_id,
            0 AS level,
            (e.employee_id)::text AS path
           FROM (public.employees e
             JOIN public.employment_info ei ON (((e.employee_id)::text = (ei.employee_id)::text)))
          WHERE ((ei.manager_id IS NULL) AND ((e.employment_status)::text = 'Active'::text))
        UNION ALL
         SELECT e.employee_id,
            e.full_name_english,
            ei.manager_id,
            (h.level + 1),
            ((h.path || ' -> '::text) || (e.employee_id)::text) AS text
           FROM ((public.employees e
             JOIN public.employment_info ei ON (((e.employee_id)::text = (ei.employee_id)::text)))
             JOIN hierarchy h ON (((ei.manager_id)::text = (h.employee_id)::text)))
          WHERE ((e.employment_status)::text = 'Active'::text)
        )
 SELECT employee_id,
    full_name_english,
    manager_id,
    level,
    path
   FROM hierarchy
  ORDER BY level, full_name_english;


ALTER VIEW public.employee_hierarchy OWNER TO postgres;

--
-- Name: employee_skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_skills (
    id integer NOT NULL,
    employee_id character varying(50) NOT NULL,
    skill_id integer NOT NULL,
    skill_type character varying(30) NOT NULL,
    proficiency_level integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT employee_skills_proficiency_level_check CHECK (((proficiency_level >= 1) AND (proficiency_level <= 5))),
    CONSTRAINT employee_skills_skill_type_check CHECK (((skill_type)::text = ANY ((ARRAY['main_technical'::character varying, 'secondary_technical'::character varying, 'other_technical'::character varying])::text[])))
);


ALTER TABLE public.employee_skills OWNER TO postgres;

--
-- Name: employee_skills_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_skills_id_seq OWNER TO postgres;

--
-- Name: employee_skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_skills_id_seq OWNED BY public.employee_skills.id;


--
-- Name: employee_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.employee_summary AS
 SELECT e.employee_id,
    e.full_name_english,
    e.full_name_vietnamese,
    e.display_name,
    e.employment_status,
    d.name AS department_name,
    d.code AS department_code,
    ei.position_english,
    ei.position_vietnamese,
    ei.grade,
    ei.working_type,
    ei.onboarding_date,
    c.personal_email,
    c.company_email,
    c.mobile_phone
   FROM (((public.employees e
     LEFT JOIN public.employment_info ei ON (((e.employee_id)::text = (ei.employee_id)::text)))
     LEFT JOIN public.departments d ON ((ei.department_id = d.id)))
     LEFT JOIN public.contact_info c ON (((e.employee_id)::text = (c.employee_id)::text)))
  WHERE ((e.employment_status)::text = 'Active'::text);


ALTER VIEW public.employee_summary OWNER TO postgres;

--
-- Name: employees_number_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employees_number_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employees_number_seq OWNER TO postgres;

--
-- Name: employees_number_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employees_number_seq OWNED BY public.employees.number;


--
-- Name: employment_info_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employment_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employment_info_id_seq OWNER TO postgres;

--
-- Name: employment_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employment_info_id_seq OWNED BY public.employment_info.id;


--
-- Name: financial_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.financial_info (
    id integer NOT NULL,
    employee_id character varying(50) NOT NULL,
    social_insurance_number character varying(20),
    tax_code character varying(20),
    number_of_dependents integer DEFAULT 0,
    bank_account_number character varying(30),
    beneficiary_name character varying(150),
    bank_name character varying(100),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.financial_info OWNER TO postgres;

--
-- Name: financial_info_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.financial_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.financial_info_id_seq OWNER TO postgres;

--
-- Name: financial_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.financial_info_id_seq OWNED BY public.financial_info.id;


--
-- Name: leave_approvals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_approvals (
    id integer NOT NULL,
    leave_request_id integer NOT NULL,
    approver_id character varying(50) NOT NULL,
    approval_level integer NOT NULL,
    status character varying(20) DEFAULT 'pending'::character varying,
    approved_at timestamp with time zone,
    comments text,
    is_required boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT leave_approvals_status_check CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying, 'delegated'::character varying, 'skipped'::character varying])::text[])))
);


ALTER TABLE public.leave_approvals OWNER TO postgres;

--
-- Name: TABLE leave_approvals; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.leave_approvals IS 'Approval steps for leave requests with comments';


--
-- Name: leave_approvals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leave_approvals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leave_approvals_id_seq OWNER TO postgres;

--
-- Name: leave_approvals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leave_approvals_id_seq OWNED BY public.leave_approvals.id;


--
-- Name: leave_balances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_balances (
    id integer NOT NULL,
    employee_id character varying(50) NOT NULL,
    leave_type_id integer NOT NULL,
    year integer NOT NULL,
    total_allocated numeric(4,1) DEFAULT 0,
    carried_forward numeric(4,1) DEFAULT 0,
    used numeric(4,1) DEFAULT 0,
    pending numeric(4,1) DEFAULT 0,
    available numeric(4,1) GENERATED ALWAYS AS ((((total_allocated + carried_forward) - used) - pending)) STORED,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_year CHECK (((year >= 2020) AND (year <= 2120)))
);


ALTER TABLE public.leave_balances OWNER TO postgres;

--
-- Name: TABLE leave_balances; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.leave_balances IS 'Employee leave balance tracking by year and leave type';


--
-- Name: COLUMN leave_balances.available; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.leave_balances.available IS 'Computed column: total_allocated + carried_forward - used - pending';


--
-- Name: leave_types; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_types (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    code character varying(10) NOT NULL,
    description text,
    max_days_per_year integer,
    carry_forward_allowed boolean DEFAULT false,
    max_carry_forward_days integer DEFAULT 0,
    requires_medical_certificate boolean DEFAULT false,
    advance_notice_days integer DEFAULT 1,
    max_consecutive_days integer,
    approval_levels integer DEFAULT 1,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.leave_types OWNER TO postgres;

--
-- Name: leave_balance_summary; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.leave_balance_summary AS
 SELECT lb.employee_id,
    e.full_name_english,
    lt.name AS leave_type_name,
    lt.code AS leave_type_code,
    lb.year,
    lb.total_allocated,
    lb.carried_forward,
    lb.used,
    lb.pending,
    lb.available
   FROM ((public.leave_balances lb
     JOIN public.employees e ON (((lb.employee_id)::text = (e.employee_id)::text)))
     JOIN public.leave_types lt ON ((lb.leave_type_id = lt.id)))
  WHERE ((e.employment_status)::text = 'Active'::text)
  ORDER BY lb.employee_id, lb.year DESC, lt.name;


ALTER VIEW public.leave_balance_summary OWNER TO postgres;

--
-- Name: leave_balances_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leave_balances_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leave_balances_id_seq OWNER TO postgres;

--
-- Name: leave_balances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leave_balances_id_seq OWNED BY public.leave_balances.id;


--
-- Name: leave_documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_documents (
    id integer NOT NULL,
    leave_request_id integer NOT NULL,
    document_type character varying(50) NOT NULL,
    file_name character varying(255) NOT NULL,
    file_path character varying(500) NOT NULL,
    file_size integer,
    mime_type character varying(100),
    uploaded_by character varying(50) NOT NULL,
    uploaded_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.leave_documents OWNER TO postgres;

--
-- Name: leave_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leave_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leave_documents_id_seq OWNER TO postgres;

--
-- Name: leave_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leave_documents_id_seq OWNED BY public.leave_documents.id;


--
-- Name: leave_policies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_policies (
    id integer NOT NULL,
    employee_id character varying(50),
    department_id integer,
    "position" character varying(100),
    leave_type_id integer NOT NULL,
    allocated_days numeric(4,1) NOT NULL,
    effective_from date NOT NULL,
    effective_to date,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_policy_dates CHECK (((effective_to IS NULL) OR (effective_to >= effective_from)))
);


ALTER TABLE public.leave_policies OWNER TO postgres;

--
-- Name: leave_policies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leave_policies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leave_policies_id_seq OWNER TO postgres;

--
-- Name: leave_policies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leave_policies_id_seq OWNED BY public.leave_policies.id;


--
-- Name: leave_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.leave_requests (
    id integer NOT NULL,
    employee_id character varying(50) NOT NULL,
    leave_type_id integer NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    total_days numeric(3,1) NOT NULL,
    reason text,
    status character varying(20) DEFAULT 'pending'::character varying,
    current_approval_level integer DEFAULT 1,
    created_by character varying(50) NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_dates CHECK ((end_date >= start_date)),
    CONSTRAINT check_total_days CHECK ((total_days > (0)::numeric)),
    CONSTRAINT leave_requests_status_check CHECK (((status)::text = ANY ((ARRAY['draft'::character varying, 'pending'::character varying, 'approved'::character varying, 'rejected'::character varying, 'cancelled'::character varying, 'withdrawn'::character varying])::text[])))
);


ALTER TABLE public.leave_requests OWNER TO postgres;

--
-- Name: TABLE leave_requests; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.leave_requests IS 'Employee leave requests with approval workflow';


--
-- Name: leave_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leave_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leave_requests_id_seq OWNER TO postgres;

--
-- Name: leave_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leave_requests_id_seq OWNED BY public.leave_requests.id;


--
-- Name: leave_types_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.leave_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.leave_types_id_seq OWNER TO postgres;

--
-- Name: leave_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.leave_types_id_seq OWNED BY public.leave_types.id;


--
-- Name: pending_leave_approvals; Type: VIEW; Schema: public; Owner: postgres
--

CREATE VIEW public.pending_leave_approvals AS
 SELECT lr.id AS request_id,
    lr.employee_id,
    e.full_name_english AS employee_name,
    lt.name AS leave_type,
    lr.start_date,
    lr.end_date,
    lr.total_days,
    lr.reason,
    la.approver_id,
    approver.full_name_english AS approver_name,
    la.approval_level,
    la.is_required,
    lr.created_at AS request_created_at
   FROM ((((public.leave_requests lr
     JOIN public.employees e ON (((lr.employee_id)::text = (e.employee_id)::text)))
     JOIN public.leave_types lt ON ((lr.leave_type_id = lt.id)))
     JOIN public.leave_approvals la ON ((lr.id = la.leave_request_id)))
     JOIN public.employees approver ON (((la.approver_id)::text = (approver.employee_id)::text)))
  WHERE (((lr.status)::text = 'pending'::text) AND ((la.status)::text = 'pending'::text) AND (la.approval_level = lr.current_approval_level))
  ORDER BY lr.created_at;


ALTER VIEW public.pending_leave_approvals OWNER TO postgres;

--
-- Name: personal_info; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.personal_info (
    id integer NOT NULL,
    employee_id character varying(50) NOT NULL,
    gender character varying(10),
    date_of_birth date,
    place_of_birth character varying(200),
    nationality character varying(50),
    nationality_vietnamese character varying(50),
    ethnicity character varying(50),
    identity_card_number character varying(20),
    passport_number character varying(20),
    date_of_issue_identity_card date,
    date_of_issue_passport date,
    place_of_issue_identity_card_vi character varying(200),
    place_of_issue_passport_vi character varying(200),
    place_of_issue_identity_card_en character varying(200),
    place_of_issue_passport_en character varying(200),
    academic_level character varying(100),
    certificate text,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT personal_info_gender_check CHECK (((gender)::text = ANY ((ARRAY['Male'::character varying, 'Female'::character varying, 'Other'::character varying])::text[])))
);


ALTER TABLE public.personal_info OWNER TO postgres;

--
-- Name: personal_info_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.personal_info_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.personal_info_id_seq OWNER TO postgres;

--
-- Name: personal_info_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.personal_info_id_seq OWNED BY public.personal_info.id;


--
-- Name: skills; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.skills (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    category character varying(50),
    description text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.skills OWNER TO postgres;

--
-- Name: skills_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.skills_id_seq OWNER TO postgres;

--
-- Name: skills_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.skills_id_seq OWNED BY public.skills.id;


--
-- Name: approval_workflow_steps id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_workflow_steps ALTER COLUMN id SET DEFAULT nextval('public.approval_workflow_steps_id_seq'::regclass);


--
-- Name: approval_workflows id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_workflows ALTER COLUMN id SET DEFAULT nextval('public.approval_workflows_id_seq'::regclass);


--
-- Name: audit_logs id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs ALTER COLUMN id SET DEFAULT nextval('public.audit_logs_id_seq'::regclass);


--
-- Name: contact_info id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_info ALTER COLUMN id SET DEFAULT nextval('public.contact_info_id_seq'::regclass);


--
-- Name: contracts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts ALTER COLUMN id SET DEFAULT nextval('public.contracts_id_seq'::regclass);


--
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);


--
-- Name: employee_contacts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_contacts ALTER COLUMN id SET DEFAULT nextval('public.employee_contacts_id_seq'::regclass);


--
-- Name: employee_skills id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_skills ALTER COLUMN id SET DEFAULT nextval('public.employee_skills_id_seq'::regclass);


--
-- Name: employees number; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees ALTER COLUMN number SET DEFAULT nextval('public.employees_number_seq'::regclass);


--
-- Name: employment_info id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employment_info ALTER COLUMN id SET DEFAULT nextval('public.employment_info_id_seq'::regclass);


--
-- Name: financial_info id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financial_info ALTER COLUMN id SET DEFAULT nextval('public.financial_info_id_seq'::regclass);


--
-- Name: leave_approvals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_approvals ALTER COLUMN id SET DEFAULT nextval('public.leave_approvals_id_seq'::regclass);


--
-- Name: leave_balances id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_balances ALTER COLUMN id SET DEFAULT nextval('public.leave_balances_id_seq'::regclass);


--
-- Name: leave_documents id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_documents ALTER COLUMN id SET DEFAULT nextval('public.leave_documents_id_seq'::regclass);


--
-- Name: leave_policies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_policies ALTER COLUMN id SET DEFAULT nextval('public.leave_policies_id_seq'::regclass);


--
-- Name: leave_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests ALTER COLUMN id SET DEFAULT nextval('public.leave_requests_id_seq'::regclass);


--
-- Name: leave_types id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_types ALTER COLUMN id SET DEFAULT nextval('public.leave_types_id_seq'::regclass);


--
-- Name: personal_info id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_info ALTER COLUMN id SET DEFAULT nextval('public.personal_info_id_seq'::regclass);


--
-- Name: skills id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills ALTER COLUMN id SET DEFAULT nextval('public.skills_id_seq'::regclass);


--
-- Data for Name: approval_workflow_steps; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: approval_workflows; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: audit_logs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: contact_info; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: contracts; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.departments (id, name, code, description, head_id, parent_department_id, is_active, created_at, updated_at) VALUES (1, 'Information Technology', 'IT', 'Technology and development department', NULL, NULL, true, '2025-06-09 17:15:08.287398+07', '2025-06-09 17:15:08.287398+07');
INSERT INTO public.departments (id, name, code, description, head_id, parent_department_id, is_active, created_at, updated_at) VALUES (2, 'Human Resources', 'HR', 'Human resources management', NULL, NULL, true, '2025-06-09 17:15:08.287398+07', '2025-06-09 17:15:08.287398+07');
INSERT INTO public.departments (id, name, code, description, head_id, parent_department_id, is_active, created_at, updated_at) VALUES (3, 'Finance', 'FIN', 'Financial management and accounting', NULL, NULL, true, '2025-06-09 17:15:08.287398+07', '2025-06-09 17:15:08.287398+07');
INSERT INTO public.departments (id, name, code, description, head_id, parent_department_id, is_active, created_at, updated_at) VALUES (4, 'Sales', 'SALES', 'Sales and business development', NULL, NULL, true, '2025-06-09 17:15:08.287398+07', '2025-06-09 17:15:08.287398+07');
INSERT INTO public.departments (id, name, code, description, head_id, parent_department_id, is_active, created_at, updated_at) VALUES (5, 'Marketing', 'MKT', 'Marketing and communications', NULL, NULL, true, '2025-06-09 17:15:08.287398+07', '2025-06-09 17:15:08.287398+07');


--
-- Data for Name: employee_contacts; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: employee_skills; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: employment_info; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: financial_info; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: leave_approvals; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: leave_balances; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: leave_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: leave_policies; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: leave_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: leave_types; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.leave_types (id, name, code, description, max_days_per_year, carry_forward_allowed, max_carry_forward_days, requires_medical_certificate, advance_notice_days, max_consecutive_days, approval_levels, is_active, created_at, updated_at) VALUES (1, 'Annual Leave', 'AL', 'Yearly vacation leave', 20, true, 5, false, 7, NULL, 1, true, '2025-06-09 17:15:08.291119+07', '2025-06-09 17:15:08.291119+07');
INSERT INTO public.leave_types (id, name, code, description, max_days_per_year, carry_forward_allowed, max_carry_forward_days, requires_medical_certificate, advance_notice_days, max_consecutive_days, approval_levels, is_active, created_at, updated_at) VALUES (2, 'Sick Leave', 'SL', 'Medical leave', 30, false, 0, false, 1, NULL, 1, true, '2025-06-09 17:15:08.291119+07', '2025-06-09 17:15:08.291119+07');
INSERT INTO public.leave_types (id, name, code, description, max_days_per_year, carry_forward_allowed, max_carry_forward_days, requires_medical_certificate, advance_notice_days, max_consecutive_days, approval_levels, is_active, created_at, updated_at) VALUES (3, 'Maternity Leave', 'ML', 'Maternity leave for mothers', 180, false, 0, false, 30, NULL, 1, true, '2025-06-09 17:15:08.291119+07', '2025-06-09 17:15:08.291119+07');
INSERT INTO public.leave_types (id, name, code, description, max_days_per_year, carry_forward_allowed, max_carry_forward_days, requires_medical_certificate, advance_notice_days, max_consecutive_days, approval_levels, is_active, created_at, updated_at) VALUES (4, 'Paternity Leave', 'PL', 'Paternity leave for fathers', 7, false, 0, false, 30, NULL, 1, true, '2025-06-09 17:15:08.291119+07', '2025-06-09 17:15:08.291119+07');
INSERT INTO public.leave_types (id, name, code, description, max_days_per_year, carry_forward_allowed, max_carry_forward_days, requires_medical_certificate, advance_notice_days, max_consecutive_days, approval_levels, is_active, created_at, updated_at) VALUES (5, 'Marriage Leave', 'MAL', 'Leave for marriage', 3, false, 0, false, 14, NULL, 1, true, '2025-06-09 17:15:08.291119+07', '2025-06-09 17:15:08.291119+07');
INSERT INTO public.leave_types (id, name, code, description, max_days_per_year, carry_forward_allowed, max_carry_forward_days, requires_medical_certificate, advance_notice_days, max_consecutive_days, approval_levels, is_active, created_at, updated_at) VALUES (6, 'Bereavement Leave', 'BL', 'Leave for family bereavement', 5, false, 0, false, 1, NULL, 1, true, '2025-06-09 17:15:08.291119+07', '2025-06-09 17:15:08.291119+07');
INSERT INTO public.leave_types (id, name, code, description, max_days_per_year, carry_forward_allowed, max_carry_forward_days, requires_medical_certificate, advance_notice_days, max_consecutive_days, approval_levels, is_active, created_at, updated_at) VALUES (7, 'Emergency Leave', 'EL', 'Emergency leave', 3, false, 0, false, 0, NULL, 1, true, '2025-06-09 17:15:08.291119+07', '2025-06-09 17:15:08.291119+07');
INSERT INTO public.leave_types (id, name, code, description, max_days_per_year, carry_forward_allowed, max_carry_forward_days, requires_medical_certificate, advance_notice_days, max_consecutive_days, approval_levels, is_active, created_at, updated_at) VALUES (8, 'Unpaid Leave', 'UL', 'Unpaid personal leave', 0, false, 0, false, 14, NULL, 1, true, '2025-06-09 17:15:08.291119+07', '2025-06-09 17:15:08.291119+07');


--
-- Data for Name: personal_info; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: skills; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.skills (id, name, category, description, is_active, created_at, updated_at) VALUES (1, 'Python Programming', 'Technical', NULL, true, '2025-06-09 17:15:08.294379+07', '2025-06-09 17:15:08.294379+07');
INSERT INTO public.skills (id, name, category, description, is_active, created_at, updated_at) VALUES (2, 'JavaScript', 'Technical', NULL, true, '2025-06-09 17:15:08.294379+07', '2025-06-09 17:15:08.294379+07');
INSERT INTO public.skills (id, name, category, description, is_active, created_at, updated_at) VALUES (3, 'React', 'Technical', NULL, true, '2025-06-09 17:15:08.294379+07', '2025-06-09 17:15:08.294379+07');
INSERT INTO public.skills (id, name, category, description, is_active, created_at, updated_at) VALUES (4, 'SQL Database', 'Technical', NULL, true, '2025-06-09 17:15:08.294379+07', '2025-06-09 17:15:08.294379+07');
INSERT INTO public.skills (id, name, category, description, is_active, created_at, updated_at) VALUES (5, 'Project Management', 'Soft Skills', NULL, true, '2025-06-09 17:15:08.294379+07', '2025-06-09 17:15:08.294379+07');
INSERT INTO public.skills (id, name, category, description, is_active, created_at, updated_at) VALUES (6, 'Communication', 'Soft Skills', NULL, true, '2025-06-09 17:15:08.294379+07', '2025-06-09 17:15:08.294379+07');
INSERT INTO public.skills (id, name, category, description, is_active, created_at, updated_at) VALUES (7, 'Leadership', 'Soft Skills', NULL, true, '2025-06-09 17:15:08.294379+07', '2025-06-09 17:15:08.294379+07');
INSERT INTO public.skills (id, name, category, description, is_active, created_at, updated_at) VALUES (8, 'English', 'Languages', NULL, true, '2025-06-09 17:15:08.294379+07', '2025-06-09 17:15:08.294379+07');
INSERT INTO public.skills (id, name, category, description, is_active, created_at, updated_at) VALUES (9, 'Japanese', 'Languages', NULL, true, '2025-06-09 17:15:08.294379+07', '2025-06-09 17:15:08.294379+07');


--
-- Name: approval_workflow_steps_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.approval_workflow_steps_id_seq', 1, false);


--
-- Name: approval_workflows_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.approval_workflows_id_seq', 1, false);


--
-- Name: audit_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_logs_id_seq', 1, false);


--
-- Name: contact_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contact_info_id_seq', 1, false);


--
-- Name: contracts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.contracts_id_seq', 1, false);


--
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.departments_id_seq', 5, true);


--
-- Name: employee_contacts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_contacts_id_seq', 1, false);


--
-- Name: employee_skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_skills_id_seq', 1, false);


--
-- Name: employees_number_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employees_number_seq', 1, false);


--
-- Name: employment_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employment_info_id_seq', 1, false);


--
-- Name: financial_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.financial_info_id_seq', 1, false);


--
-- Name: leave_approvals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.leave_approvals_id_seq', 1, false);


--
-- Name: leave_balances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.leave_balances_id_seq', 1, false);


--
-- Name: leave_documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.leave_documents_id_seq', 1, false);


--
-- Name: leave_policies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.leave_policies_id_seq', 1, false);


--
-- Name: leave_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.leave_requests_id_seq', 1, false);


--
-- Name: leave_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.leave_types_id_seq', 8, true);


--
-- Name: personal_info_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.personal_info_id_seq', 1, false);


--
-- Name: skills_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.skills_id_seq', 9, true);


--
-- Name: approval_workflow_steps approval_workflow_steps_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_workflow_steps
    ADD CONSTRAINT approval_workflow_steps_pkey PRIMARY KEY (id);


--
-- Name: approval_workflow_steps approval_workflow_steps_workflow_id_step_order_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_workflow_steps
    ADD CONSTRAINT approval_workflow_steps_workflow_id_step_order_key UNIQUE (workflow_id, step_order);


--
-- Name: approval_workflows approval_workflows_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_workflows
    ADD CONSTRAINT approval_workflows_pkey PRIMARY KEY (id);


--
-- Name: audit_logs audit_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_pkey PRIMARY KEY (id);


--
-- Name: contact_info contact_info_employee_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_info
    ADD CONSTRAINT contact_info_employee_id_key UNIQUE (employee_id);


--
-- Name: contact_info contact_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_info
    ADD CONSTRAINT contact_info_pkey PRIMARY KEY (id);


--
-- Name: contracts contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_pkey PRIMARY KEY (id);


--
-- Name: departments departments_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_code_key UNIQUE (code);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: employee_contacts employee_contacts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_contacts
    ADD CONSTRAINT employee_contacts_pkey PRIMARY KEY (id);


--
-- Name: employee_skills employee_skills_employee_id_skill_id_skill_type_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_skills
    ADD CONSTRAINT employee_skills_employee_id_skill_id_skill_type_key UNIQUE (employee_id, skill_id, skill_type);


--
-- Name: employee_skills employee_skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_skills
    ADD CONSTRAINT employee_skills_pkey PRIMARY KEY (id);


--
-- Name: employees employees_number_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_number_key UNIQUE (number);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (employee_id);


--
-- Name: employment_info employment_info_employee_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employment_info
    ADD CONSTRAINT employment_info_employee_id_key UNIQUE (employee_id);


--
-- Name: employment_info employment_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employment_info
    ADD CONSTRAINT employment_info_pkey PRIMARY KEY (id);


--
-- Name: financial_info financial_info_employee_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financial_info
    ADD CONSTRAINT financial_info_employee_id_key UNIQUE (employee_id);


--
-- Name: financial_info financial_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financial_info
    ADD CONSTRAINT financial_info_pkey PRIMARY KEY (id);


--
-- Name: leave_approvals leave_approvals_leave_request_id_approval_level_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_approvals
    ADD CONSTRAINT leave_approvals_leave_request_id_approval_level_key UNIQUE (leave_request_id, approval_level);


--
-- Name: leave_approvals leave_approvals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_approvals
    ADD CONSTRAINT leave_approvals_pkey PRIMARY KEY (id);


--
-- Name: leave_balances leave_balances_employee_id_leave_type_id_year_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_balances
    ADD CONSTRAINT leave_balances_employee_id_leave_type_id_year_key UNIQUE (employee_id, leave_type_id, year);


--
-- Name: leave_balances leave_balances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_balances
    ADD CONSTRAINT leave_balances_pkey PRIMARY KEY (id);


--
-- Name: leave_documents leave_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_documents
    ADD CONSTRAINT leave_documents_pkey PRIMARY KEY (id);


--
-- Name: leave_policies leave_policies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_policies
    ADD CONSTRAINT leave_policies_pkey PRIMARY KEY (id);


--
-- Name: leave_requests leave_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_pkey PRIMARY KEY (id);


--
-- Name: leave_types leave_types_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_types
    ADD CONSTRAINT leave_types_code_key UNIQUE (code);


--
-- Name: leave_types leave_types_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_types
    ADD CONSTRAINT leave_types_pkey PRIMARY KEY (id);


--
-- Name: personal_info personal_info_employee_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_info
    ADD CONSTRAINT personal_info_employee_id_key UNIQUE (employee_id);


--
-- Name: personal_info personal_info_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_info
    ADD CONSTRAINT personal_info_pkey PRIMARY KEY (id);


--
-- Name: skills skills_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.skills
    ADD CONSTRAINT skills_pkey PRIMARY KEY (id);


--
-- Name: idx_audit_logs_changed_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_changed_at ON public.audit_logs USING btree (changed_at);


--
-- Name: idx_audit_logs_changed_by; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_changed_by ON public.audit_logs USING btree (changed_by);


--
-- Name: idx_audit_logs_table_record; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_logs_table_record ON public.audit_logs USING btree (table_name, record_id);


--
-- Name: idx_contracts_active; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contracts_active ON public.contracts USING btree (is_active);


--
-- Name: idx_contracts_dates; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contracts_dates ON public.contracts USING btree (start_date, end_date);


--
-- Name: idx_contracts_employee_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contracts_employee_id ON public.contracts USING btree (employee_id);


--
-- Name: idx_contracts_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_contracts_type ON public.contracts USING btree (contract_type);


--
-- Name: idx_employee_contacts_emergency; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employee_contacts_emergency ON public.employee_contacts USING btree (is_emergency_contact);


--
-- Name: idx_employee_contacts_employee_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employee_contacts_employee_id ON public.employee_contacts USING btree (employee_id);


--
-- Name: idx_employee_contacts_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employee_contacts_type ON public.employee_contacts USING btree (contact_type);


--
-- Name: idx_employee_skills_employee_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employee_skills_employee_id ON public.employee_skills USING btree (employee_id);


--
-- Name: idx_employee_skills_skill_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employee_skills_skill_id ON public.employee_skills USING btree (skill_id);


--
-- Name: idx_employee_skills_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employee_skills_type ON public.employee_skills USING btree (skill_type);


--
-- Name: idx_employees_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employees_created_at ON public.employees USING btree (created_at);


--
-- Name: idx_employees_employment_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employees_employment_status ON public.employees USING btree (employment_status);


--
-- Name: idx_employment_info_department; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employment_info_department ON public.employment_info USING btree (department_id);


--
-- Name: idx_employment_info_manager; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employment_info_manager ON public.employment_info USING btree (manager_id);


--
-- Name: idx_employment_info_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_employment_info_status ON public.employment_info USING btree (employee_status);


--
-- Name: idx_leave_approvals_approver_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leave_approvals_approver_id ON public.leave_approvals USING btree (approver_id);


--
-- Name: idx_leave_approvals_level; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leave_approvals_level ON public.leave_approvals USING btree (approval_level);


--
-- Name: idx_leave_approvals_request_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leave_approvals_request_id ON public.leave_approvals USING btree (leave_request_id);


--
-- Name: idx_leave_approvals_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leave_approvals_status ON public.leave_approvals USING btree (status);


--
-- Name: idx_leave_balances_employee_year; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leave_balances_employee_year ON public.leave_balances USING btree (employee_id, year);


--
-- Name: idx_leave_balances_type_year; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leave_balances_type_year ON public.leave_balances USING btree (leave_type_id, year);


--
-- Name: idx_leave_requests_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leave_requests_created_at ON public.leave_requests USING btree (created_at);


--
-- Name: idx_leave_requests_dates; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leave_requests_dates ON public.leave_requests USING btree (start_date, end_date);


--
-- Name: idx_leave_requests_employee_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leave_requests_employee_id ON public.leave_requests USING btree (employee_id);


--
-- Name: idx_leave_requests_status; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leave_requests_status ON public.leave_requests USING btree (status);


--
-- Name: idx_leave_requests_type; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_leave_requests_type ON public.leave_requests USING btree (leave_type_id);


--
-- Name: idx_personal_info_identity_card; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_personal_info_identity_card ON public.personal_info USING btree (identity_card_number);


--
-- Name: idx_personal_info_passport; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_personal_info_passport ON public.personal_info USING btree (passport_number);


--
-- Name: contact_info update_contact_info_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_contact_info_updated_at BEFORE UPDATE ON public.contact_info FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: contracts update_contracts_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: employee_contacts update_employee_contacts_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_employee_contacts_updated_at BEFORE UPDATE ON public.employee_contacts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: employees update_employees_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: employment_info update_employment_info_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_employment_info_updated_at BEFORE UPDATE ON public.employment_info FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: financial_info update_financial_info_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_financial_info_updated_at BEFORE UPDATE ON public.financial_info FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: leave_approvals update_leave_approvals_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_leave_approvals_updated_at BEFORE UPDATE ON public.leave_approvals FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: leave_balances update_leave_balances_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_leave_balances_updated_at BEFORE UPDATE ON public.leave_balances FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: leave_requests update_leave_requests_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_leave_requests_updated_at BEFORE UPDATE ON public.leave_requests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: personal_info update_personal_info_updated_at; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER update_personal_info_updated_at BEFORE UPDATE ON public.personal_info FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: approval_workflow_steps approval_workflow_steps_approver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_workflow_steps
    ADD CONSTRAINT approval_workflow_steps_approver_id_fkey FOREIGN KEY (approver_id) REFERENCES public.employees(employee_id);


--
-- Name: approval_workflow_steps approval_workflow_steps_workflow_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_workflow_steps
    ADD CONSTRAINT approval_workflow_steps_workflow_id_fkey FOREIGN KEY (workflow_id) REFERENCES public.approval_workflows(id) ON DELETE CASCADE;


--
-- Name: approval_workflows approval_workflows_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_workflows
    ADD CONSTRAINT approval_workflows_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: approval_workflows approval_workflows_leave_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approval_workflows
    ADD CONSTRAINT approval_workflows_leave_type_id_fkey FOREIGN KEY (leave_type_id) REFERENCES public.leave_types(id);


--
-- Name: audit_logs audit_logs_changed_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_logs
    ADD CONSTRAINT audit_logs_changed_by_fkey FOREIGN KEY (changed_by) REFERENCES public.employees(employee_id);


--
-- Name: contact_info contact_info_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contact_info
    ADD CONSTRAINT contact_info_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id) ON DELETE CASCADE;


--
-- Name: contracts contracts_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.contracts
    ADD CONSTRAINT contracts_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id) ON DELETE CASCADE;


--
-- Name: departments departments_parent_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_parent_department_id_fkey FOREIGN KEY (parent_department_id) REFERENCES public.departments(id);


--
-- Name: employee_contacts employee_contacts_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_contacts
    ADD CONSTRAINT employee_contacts_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id) ON DELETE CASCADE;


--
-- Name: employee_skills employee_skills_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_skills
    ADD CONSTRAINT employee_skills_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id) ON DELETE CASCADE;


--
-- Name: employee_skills employee_skills_skill_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_skills
    ADD CONSTRAINT employee_skills_skill_id_fkey FOREIGN KEY (skill_id) REFERENCES public.skills(id);


--
-- Name: employment_info employment_info_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employment_info
    ADD CONSTRAINT employment_info_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: employment_info employment_info_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employment_info
    ADD CONSTRAINT employment_info_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id) ON DELETE CASCADE;


--
-- Name: employment_info employment_info_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employment_info
    ADD CONSTRAINT employment_info_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.employees(employee_id);


--
-- Name: financial_info financial_info_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.financial_info
    ADD CONSTRAINT financial_info_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id) ON DELETE CASCADE;


--
-- Name: departments fk_departments_head; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT fk_departments_head FOREIGN KEY (head_id) REFERENCES public.employees(employee_id);


--
-- Name: leave_approvals leave_approvals_approver_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_approvals
    ADD CONSTRAINT leave_approvals_approver_id_fkey FOREIGN KEY (approver_id) REFERENCES public.employees(employee_id);


--
-- Name: leave_approvals leave_approvals_leave_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_approvals
    ADD CONSTRAINT leave_approvals_leave_request_id_fkey FOREIGN KEY (leave_request_id) REFERENCES public.leave_requests(id) ON DELETE CASCADE;


--
-- Name: leave_balances leave_balances_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_balances
    ADD CONSTRAINT leave_balances_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id) ON DELETE CASCADE;


--
-- Name: leave_balances leave_balances_leave_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_balances
    ADD CONSTRAINT leave_balances_leave_type_id_fkey FOREIGN KEY (leave_type_id) REFERENCES public.leave_types(id);


--
-- Name: leave_documents leave_documents_leave_request_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_documents
    ADD CONSTRAINT leave_documents_leave_request_id_fkey FOREIGN KEY (leave_request_id) REFERENCES public.leave_requests(id) ON DELETE CASCADE;


--
-- Name: leave_documents leave_documents_uploaded_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_documents
    ADD CONSTRAINT leave_documents_uploaded_by_fkey FOREIGN KEY (uploaded_by) REFERENCES public.employees(employee_id);


--
-- Name: leave_policies leave_policies_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_policies
    ADD CONSTRAINT leave_policies_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: leave_policies leave_policies_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_policies
    ADD CONSTRAINT leave_policies_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id);


--
-- Name: leave_policies leave_policies_leave_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_policies
    ADD CONSTRAINT leave_policies_leave_type_id_fkey FOREIGN KEY (leave_type_id) REFERENCES public.leave_types(id);


--
-- Name: leave_requests leave_requests_created_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.employees(employee_id);


--
-- Name: leave_requests leave_requests_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id) ON DELETE CASCADE;


--
-- Name: leave_requests leave_requests_leave_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_leave_type_id_fkey FOREIGN KEY (leave_type_id) REFERENCES public.leave_types(id);


--
-- Name: personal_info personal_info_employee_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.personal_info
    ADD CONSTRAINT personal_info_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(employee_id) ON DELETE CASCADE;


--
-- END
--
