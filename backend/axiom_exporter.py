from opentelemetry import trace, metrics
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.sdk.resources import Resource, SERVICE_NAME
from opentelemetry.exporter.otlp.proto.http.trace_exporter import OTLPSpanExporter
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader
from opentelemetry.exporter.otlp.proto.http.metric_exporter import OTLPMetricExporter

# ------- CONFIG AXIOM -------
AXIOM_TOKEN = "xaat-8878c454-b25d-4ca8-8f88-71c5d558ba59"
AXIOM_DATASET = "shoppingapi"   # nombre de tu dataset en Axiom

# Nombre del servicio (aparece en Axiom)
resource = Resource(
    attributes={
        SERVICE_NAME: "shoppingapi"
    }
)

# ----------- TRACES -----------
provider = TracerProvider(resource=resource)
trace.set_tracer_provider(provider)

otlp_span_exporter = OTLPSpanExporter(
    endpoint="https://api.axiom.co/v1/traces",
    headers={
        "Authorization": f"Bearer {AXIOM_TOKEN}",
        "X-Axiom-Dataset": AXIOM_DATASET,
    },
)

provider.add_span_processor(BatchSpanProcessor(otlp_span_exporter))

# Tracer principal del servicio
service_tracer = trace.get_tracer("shoppingapi")

# ----------- METRICS -----------
otlp_metric_exporter = OTLPMetricExporter(
    endpoint="https://api.axiom.co/v1/metrics",
    headers={
        "Authorization": f"Bearer {AXIOM_TOKEN}",
        "X-Axiom-Dataset": AXIOM_DATASET,
    },
)

metric_reader = PeriodicExportingMetricReader(otlp_metric_exporter)
meter_provider = MeterProvider(resource=resource, metric_readers=[metric_reader])
metrics.set_meter_provider(meter_provider)

service_meter = metrics.get_meter("shoppingapi")

# Contador de requests (ejemplo sencillo)
request_counter = service_meter.create_counter(
    name="shoppingapi_requests_total",
    unit="1",
    description="Total de requests manejados por Shopping API",
)