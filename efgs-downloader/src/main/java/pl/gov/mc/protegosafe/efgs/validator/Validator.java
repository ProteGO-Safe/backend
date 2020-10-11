package pl.gov.mc.protegosafe.efgs.validator;

import eu.interop.federationgateway.model.EfgsProto;
import pl.gov.mc.protegosafe.efgs.http.AuditResponse;

import java.util.List;

public interface Validator {

    boolean validateDiagnosisKeyWithSignature(EfgsProto.DiagnosisKeyBatch diagnosisKeyBatch, List<AuditResponse> auditResponses);
}
